const Sequelize=require('sequelize')

const sequelize= new Sequelize(`${process.env.defaultDB}`,`${process.env.sqlUser}`, `${process.env.sqlPassword}`,{
    dialect:'mysql',
    host:'localhost'
})



module.exports=sequelize;