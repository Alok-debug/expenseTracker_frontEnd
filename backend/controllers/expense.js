const Expense = require('../models/expense');
const query = require('express/lib/middleware/query');
const UserServices = require('../services/userServices');
const S3Services = require('../services/s3Services');

exports.downloadExpense=async (req,res,next)=>{
    try {
        const expenses=await UserServices.getExpenses(req);
        const userId=req.user.id
        const stringified=JSON.stringify(expenses)
        const fileName=`expenses${userId}/${new Date()}`
        const downloadLink=await S3Services.uploadToS3(fileName,stringified)
        await req.user.createDownload({fileName:`${new Date()}`,link:`${downloadLink}`})
        res.status(200).json({success:true,fileUrl:downloadLink})
    } catch (error) {
        res.status(500).json({success:false,error})
    }
}

exports.previousDownload=(req,res,next)=>{
    req.user.getDownloads()
    .then(downloads=>{
        res.status(200).json({success:true,links:downloads})
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({success:false,error:err})
    })
}


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
    //console.log('get reuest recieved!');
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
