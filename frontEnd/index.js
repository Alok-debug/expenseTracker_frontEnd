function notifyUser(message){
    const container = document.getElementById('notification__Container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}</h4>`;
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
        },2500)
}
// for update operation
let updateDataId = [];
var updatebtnn = document.getElementById('updatebtn');
updatebtnn.addEventListener('click', updateDataToCloud);

async function updateDataToCloud(e) {
    e.preventDefault();
    var expenseData = {
        expenseCat: `${document.getElementById('exp_cat').value}`,
        expenseAmt: `${document.getElementById('E_amount').value}`,//form.children[1].value 
        expenseDes: `${document.getElementById('descript').value}`
        
    };
    document.getElementById('updatebtn').style.display = 'none';
    document.getElementById('submitbtn').style.display = 'block';
    try {
        await axios.put(`http://localhost:5000/updateExpense/${updateDataId[0]}`, expenseData, { headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` } });
        // showNewUserOnScreen(expenseData);
        // updateDataId.pop();
    }
    catch (err) {
        console.log(err);
    }
}



var form = document.getElementById('ExpenseInputForm');
form.addEventListener('submit', storeInputToBackend);

async function storeInputToBackend(e) {
    e.preventDefault();
    var expenseData = {
        expenseAmt: `${document.getElementById('E_amount').value}`,
        expenseDes: `${document.getElementById('descript').value}`,
        expenseCat: `${document.getElementById('exp_cat').value}`
        
    };
    try {
        const res = await axios.post('http://localhost:5000/addExpense', expenseData, { headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` } });
        console.log(res);
        showNewExpenseOnScreen(res.data.expense);
        await notifyUser(res.data.message);
    } catch (err) {
        console.log(err)
    }
}

// add ul to DOM
var ul = document.createElement('ul');
ul.id = 'show__details';
var mainDiv = document.getElementById('display__Container');
mainDiv.appendChild(ul);

function showNewExpenseOnScreen(dataObj) {
    // var ulItem = document.createElement('ul');

    const liContent = `<li class="li__items" id="${dataObj.id}"> 
    ExpenseAmt: ${dataObj.amount}, Expense-Des: ${dataObj.description}, Exp. Category: ${dataObj.category}
    <button class="edit_class edit btnn">ᴇᴅɪᴛ</button>
    <button class="del_class delete btnn">❌</button>
    </li>`
    ul.innerHTML += liContent;
}




var itemList = document.getElementById('display__Container');
itemList.addEventListener('click', doSomething);

function doSomething(e) {
    if (e.target.classList.contains('delete')) {
        var liId= e.target.parentElement.id;
        if (confirm('Are you Sure?')) {
            const deleteRow = async () => {
                try {
                    let response = await axios.post(`http://localhost:5000/deleteExpense/${liId}`,{},{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
                    console.log('delete success');
                    console.log(response.data.message);
                    e.target.parentElement.remove();
                    await notifyUser(response.data.message);
                } catch (err) {
                    console.log(err);
                }
            }
            deleteRow();
            
        }
        
    }
    if (e.target.classList.contains('edit')) {
        notifyUser("edit facility is for premium users only !!!!!");
        // var li = e.target.parentElement;
        // document.getElementById('updatebtn').style.display = 'block';
        // document.getElementById('submitbtn').style.display = 'none';
        // const editdetails = async () => {
        //     try {
        //         let dataObj = await axios.get(`http://localhost:5000/getExpense/${li.id}`,{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}});
        //         console.log(dataObj.data.expenses.id);
        //         updateDataId.push(dataObj.data.expenses.id);
        //         document.getElementById('exp_cat').value = dataObj.data.expenses.category;
        //         document.getElementById('E_amount').value = dataObj.data.expenses.amount;
        //         document.getElementById('descript').value = dataObj.data.expenses.description;
        //         li.remove();
        //         //await notifyUser(dataObj.data.message);
        //     } catch (err) {
        //         console.log(err);
        //     }
        // }
        // editdetails();
        
    }
}

// when DOM Content gets loaded;
async function loadWindow () {
    try {
        const responseFromCloud = await axios.get(`http://localhost:5000/getExpenses`, { headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` } });
        //console.log(responseFromCloud.data.expenses);
        const data = responseFromCloud.data.expenses;
        data.forEach(obj =>showNewExpenseOnScreen(obj));
    }
    catch (err) {
        console.log(err)
    }
}

window.addEventListener('DOMContentLoaded', loadWindow);
    







