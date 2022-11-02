function notifyUser(message){
    const container = document.getElementById('container');
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
        showNewUserOnScreen(expenseData);
        updateDataId.pop();
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
        expenseCat: `${document.getElementById('exp_cat').value}`,
        expenseAmt: `${document.getElementById('E_amount').value}`,
        expenseDes: `${document.getElementById('descript').value}`
        
    };
    try {
        const res = await axios.post('http://localhost:5000/addExpense', expenseData, { headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` } });
        await notifyUser(res.data.message);
        showNewExpenseOnScreen(res.data);
    } catch (err) {
        console.log(err)
    }
}

// add ul to DOM
var ul = document.createElement('ul');
ul.id = 'show__details';
var mainDiv = document.getElementById('display__container');
mainDiv.appendChild(ul);

function showNewExpenseOnScreen(dataObj) {
    const ulContent = `<li class="li__items" id="${dataObj.id}"> 
    ExpenseAmt: ${dataObj.ExpenseAmt}, Expense-Des: ${dataObj.ExpenseDes}, Exp. Category: ${dataObj.ExpenseCat}
    <button class="edit_class edit btnn">ᴇᴅɪᴛ</button>
    <button class="del_class delete btnn">❌</button>
    </li>`
    ul.appendChild(ulContent);
}




var itemList = document.getElementById('display__container');
itemList.addEventListener('click', doSomething);

function doSomething(e) {
    if (e.target.classList.contains('delete')) {
        var li = e.target.parentElement;
        if (confirm('Are you Sure?')) {
            const deleteRow = async () => {
                try {
                    let response = await axios.post(`http://localhost:5000/deleteExpense/${liId}`,{},{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}})
                    console.log('delete success');
                    await notifyUser(res.data.message);
                    itemList.removeChild(li);
                } catch (err) {
                    console.log(err);
                }
            }
            deleteRow();
            
        }
        
    }
    if (e.target.classList.contains('edit')) {
        var li = e.target.parentElement;
        document.getElementById('updatebtn').style.display = 'block';
        document.getElementById('submitbtn').style.display = 'none';
        const editdetails = async () => {
            try {
                let dataObj = await axios.get(`http://localhost:5000/getExpense/${li.id}`,{},{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}});
                updateDataId.push(dataObj.data.id);
                document.getElementById('exp_cat').value = dataObj.data.ExpenseCat;
                document.getElementById('E_amount').value = dataObj.data.ExpenseAmt;
                document.getElementById('descript').value = dataObj.data.ExpenseDes;
                itemList.removeChild(li);
                await notifyUser(res.data.message);
            } catch (err) {
                console.log(err);
            }
        }
        editdetails();
        
    }
}

// when DOM Content gets loaded;
async function loadWindow () {
    try {
        const responseFromCloud = await axios.get(`http://localhost:5000/getExpense/${li.id}`,{},{headers:{'authorization':`Bearer ${localStorage.getItem('token')}`}});
        const data = responseFromCloud.data;
        data.forEach(obj =>showNewExpenseOnScreen(obj));
    }
    catch (err) {
        console.log(err)
    }
}

window.addEventListener('DOMContentLoaded', loadWindow);
    








const form = document.getElementById('');

form.addEventListener('submit', storeDataToBackend);

const storeDataToBackend = async (e) => {
    e.preventDefault()
    e.preventDefault();
    var expenseData = {
        expenseCat: `${document.getElementById('exp_cat').value}`,
        expenseAmt: `${document.getElementById('E_amount').value}`,
        expenseDes: `${document.getElementById('descript').value}`
        
    };
    amount.value = '';
    description.value = '';
    category.value = '';
    try {
        
    } catch (err) {
        console.log(err);
    }
};
