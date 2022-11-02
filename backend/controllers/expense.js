const Expense=require('../models/expense')

exports.addExpense = (req, res, next) =>{
    const expenseAmt = req.body.expenseAmt;
    const expenseDes = req.body.expenseDes;
    const expenseCat = req.body.expenseCat;
    req.user.createExpense({ amount: expenseAmt, description: expenseDes, category:expenseCat})
    .then((exp)=>{
        res.status(201).json({expense:exp,success:true,message:'expense added successfully'})
    })
    .catch(err=>{
        console.log(err)
        res.status(403).json({success:false,message:'expense not added'})

    })
}

// exports.updateExpense = (req, res, next) => {
//     const expId = req.params.expenseId;
//     const expenseAmt = req.body.expenseAmt;
//     const expenseDes = req.body.expenseDes;
//     const expenseCat = req.body.expenseCat;
//     req.user.getExpenses({ where: { id: expId } })
//         .then(expense => {
//             expense[0].dataValues.amount = expenseAmt;
//             expense[0].dataValues.description = expenseDes;
//             expense[0].dataValues.category = expenseCat;
//             return Expense.save();
//         })
//         .then(() => {
//             res.status(201).json({success:true, message:"update successfull"})
//         })
//         .catch(err => console.log(err));
// }

exports.getExpenses = (req, res, next) => {
    console.log('get reuest recieved!');
    req.user.getExpenses()
    .then(expenses=>{
        res.status(200).json({success:true,expenses:expenses})
    })
    .catch(err=>{
        console.log(err)
        res.json(err)
    })
}

exports.getExpense = (req, res, next) => {
    const expenseId = req.params.expenseId;
    console.log('get reuest recieved!');
    req.user.getExpenses({where:{id:expenseId}})
    .then(expenses=>{
        res.status(200).json({success:true,expenses:expenses[0]})
    })
    .catch(err=>{
        console.log(err)
        res.json(err)
    })
}

exports.deleteExpense=(req,res,next)=>{
    const expId=req.params.expenseId;
    req.user.getExpenses({where:{id:expId}})
    .then((expenses)=>{
        const expense=expenses[0]
        expense.destroy()
        res.status(201).json({message:'Deleted successfully'})
    })
    .catch(err=>{
        console.log(err)
    })
}
