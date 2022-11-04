const Expense = require("../models/expense");
const query = require("express/lib/middleware/query");
const UserServices = require("../services/userServices");
const S3Services = require("../services/s3Services");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.downloadExpense = async (req, res, next) => {
    try {
    const expenses = await UserServices.getExpenses(req);
    const userId = req.user.id;
    const stringified = JSON.stringify(expenses);
    const fileName = `expenses${userId}/${new Date()}`;
    const downloadLink = await S3Services.uploadToS3(fileName, stringified);
    await req.user.createDownload({
      fileName: `${new Date()}`,
      link: `${downloadLink}`,
    });
    res.status(200).json({ success: true, fileUrl: downloadLink });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.previousDownload = (req, res, next) => {
  req.user
    .getDownloads()
    .then((downloads) => {
      res.status(200).json({ success: true, links: downloads });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, error: err });
    });
};

exports.addExpense = (req, res, next) => {
    const expenseAmt = req.body.amount;
    const expenseDes = req.body.description;
    const expenseCat = req.body.category;
    //console.log(expenseAmt, expenseCat, expenseDes,req.body);
    req.user
    .createExpense({
      amount: expenseAmt,
      description: expenseDes,
      category: expenseCat,
    })
    .then((exp) => {
      res
        .status(201)
        .json({
          expense: exp,
          success: true,
          message: "expense added successfully",
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(403).json({ success: false, message: "expense not added" });
    });
};

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
  const limit = req.query.limit;
  const page = +req.query.page || 1;
  const rows = +req.query.rows || 10;
  //console.log(page, rows);
  let totalExpenses;
  let today = new Date();
  let date = new Date("1980-01-01");
  if (limit == "weekly") {
    const todayDateOnly = new Date(today.toDateString());
    date = new Date(todayDateOnly.setDate(todayDateOnly.getDate() - 6));
  } else if (limit == "daily") {
    date = new Date(today.toDateString());
  } else if (limit == "monthly") {
    date = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  req.user
    .countExpenses({
      where: {
        createdAt: { [Op.and]: [{ [Op.gte]: date }, { [Op.lte]: today }] },
      },
    })
    .then((count) => {
      totalExpenses = count;
      req.user
        .getExpenses({
          where: {
            createdAt: { [Op.and]: [{ [Op.gte]: date }, { [Op.lte]: today }] },
          },
          order: [["createdAt", "DESC"]],
          offset: (page - 1) * rows,
          limit: rows,
        })
        .then((expenses) => {
          // const filteredExpenses=expenses.filter((expense)=>{
          //     return expense.createdAt>=date;
          // })
          return res
            .status(200)
            .json({
              success: true,
              expenses: expenses,
              currentPage: page,
              hasPreviousPage: page > 1,
              hasNextPage: page * rows < totalExpenses,
              previousPage: page - 1,
              nextPage: page + 1,
                lastPage: Math.ceil(totalExpenses / rows),
              limit:limit
            });
        })
        .catch((err) => {
          throw new Error(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
};

// exports.getExpense = (req, res, next) => {
//   const expenseId = req.params.expenseId;
//   console.log("get request recieved!");
//   req.user
//     .getExpenses({ where: { id: expenseId } })
//     .then((expenses) => {
//       res.status(200).json({ success: true, expenses: expenses[0] });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.json(err);
//     });
// };

exports.deleteExpense = (req, res, next) => {
  const expId = req.params.expenseId;
  req.user
    .getExpenses({ where: { id: expId } })
    .then((expenses) => {
      const expense = expenses[0];
      expense.destroy();
      res.status(201).json({ message: "Deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
};
