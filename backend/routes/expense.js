const express=require('express')

const expenseController=require('../controllers/expense')

const authorization=require('../middleware/authorization')

const router=express.Router()

router.post('/addExpense', authorization, expenseController.addExpense);

router.get('/getExpenses', authorization, expenseController.getExpenses);

router.post('/deleteExpense/:expenseId', authorization, expenseController.deleteExpense);

//router.get('/getExpense/:expenseId', authorization, expenseController.getExpense);

//router.put('/updateExpense/:expenseId', authorization, expenseController.updateExpense);

module.exports = router;