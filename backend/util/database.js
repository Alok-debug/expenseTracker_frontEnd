const Sequelize=require('sequelize')

const sequelize= new Sequelize('expensetracker_backend','root','Qwerty@2022',{
    dialect:'mysql',
    host:'localhost'
})



module.exports=sequelize;