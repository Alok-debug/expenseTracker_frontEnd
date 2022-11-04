function notifyUser(message) {
  const container = document.getElementById("notification__Container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerHTML = `<h4>${message}</h4>`;
  container.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2500);
}
// for update operation
let updateDataId = [];
var updatebtnn = document.getElementById("updatebtn");
updatebtnn.addEventListener("click", updateDataToCloud);

async function updateDataToCloud(e) {
  e.preventDefault();
  var expenseData = {
    expenseCat: `${document.getElementById("exp_cat").value}`,
    expenseAmt: `${document.getElementById("E_amount").value}`, //form.children[1].value
    expenseDes: `${document.getElementById("descript").value}`,
  };
  document.getElementById("updatebtn").style.display = "none";
  document.getElementById("submitbtn").style.display = "block";
  try {
    await axios.put(
      `http://localhost:5000/updateExpense/${updateDataId[0]}`,
      expenseData,
      { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    // showNewUserOnScreen(expenseData);
    // updateDataId.pop();
  } catch (err) {
    console.log(err);
  }
}

var form = document.getElementById("ExpenseInputForm");
form.addEventListener("submit", storeInputToBackend);

async function storeInputToBackend(e) {
  e.preventDefault();
  var expenseData = {
    amount: `${document.getElementById("E_amount").value}`,
    description: `${document.getElementById("descript").value}`,
    category: `${document.getElementById("exp_cat").value}`,
  };
  try {
    const res = await axios.post(
      "http://localhost:5000/addExpense",
      expenseData,
      { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    console.log(res);
    showNewExpenseOnScreen(res.data.expense);
    await notifyUser(res.data.message);
  } catch (err) {
    console.log(err);
  }
}

// add ul to DOM
var ul = document.createElement("ul");
ul.id = "show__details";
var mainDiv = document.getElementById("display__Container");
mainDiv.appendChild(ul);

function showNewExpenseOnScreen(dataObj) {
  // var ulItem = document.createElement('ul');

  const liContent = `<li class="li__items" id="${dataObj.id}"> 
    <h5 class="li__headings">Amount:</h5><h6 class="li__headingValues">${dataObj.amount}</h6>
    <h5 class="li__headings">Description:</h5><h6 class="li__headingValues">${dataObj.description}</h6>
    <h5 class="li__headings">Category:</h5><h6 class="li__headingValues">${dataObj.category}</h6>  
    <button class="edit_class edit btnn">ᴇᴅɪᴛ</button>
    <button class="del_class delete btnn">❌</button>
    </li>`;
  ul.innerHTML += liContent;
}

var itemList = document.getElementById("display__Container");
itemList.addEventListener("click", doSomething);

function doSomething(e) {
  if (e.target.classList.contains("delete")) {
    var liId = e.target.parentElement.id;
    if (confirm("Are you Sure?")) {
      const deleteRow = async () => {
        try {
          let response = await axios.post(`http://localhost:5000/deleteExpense/${liId}`,{},{headers: {authorization: `Bearer ${localStorage.getItem("token")}`}});
          console.log("delete success");
          console.log(response.data.message);
          e.target.parentElement.remove();
          await notifyUser(response.data.message);
        } catch (err) {
          console.log(err);
        }
      };
      deleteRow();
    }
  }
  if (e.target.classList.contains("edit")) {
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


const loadExpensesFromDataBase = async (e) => {
  try {
    const responseFromCloud = await axios.get(
      `http://localhost:5000/getExpenses`,
      { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    //console.log(responseFromCloud.data.expenses);
    const data = responseFromCloud.data.expenses;
    data.forEach((obj) => showNewExpenseOnScreen(obj));
  } catch (err) {
    console.log(err);
  }
}
document.getElementById('get__expenses').addEventListener('click', loadExpensesFromDataBase);

  


//premium
const premiumBtn = document.getElementById("premium");
const payBtn = document.getElementById("pay");
const close = document.getElementById("close");
const container = document.getElementById("popup-container");
const amount = 100;
let orderId;

premiumBtn.addEventListener("click", () => {
  container.classList.add("active");
  axios
    .post(
      "http://localhost:5000/premium/create/order",
      { amount: amount },
      { headers: { authorization: `Bearer ${localStorage.getItem("token")}` } }
    )
      .then((response) => {
          console.log('response came after order creation:', response);
          orderId = response.data.order.id;
      payBtn.style = "display:block";
    })
    .catch((err) => {
      console.log(err);
    });
});

close.addEventListener("click", () => {
  container.classList.remove("active");
  payBtn.style = "display:none";
});

let paymentId;
let signature;

payBtn.addEventListener("click", (e) => {
  container.classList.remove("active");
  payBtn.style = "display:none";
  var options = {
    key: "rzp_test_9nESyac7Y4IPwX", // Enter the Key ID generated from the Dashboard
    amount: `${amount}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "Expense Tracker",
    description: "Premium",
    //"image": "https://example.com/your_logo",
    order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      paymentId = response.razorpay_payment_id;
      signature = response.razorpay_signature;
      alert(
        `Payment successful: your order ID: ${response.razorpay_order_id} and payment ID:${response.razorpay_payment_id}`
      );
      window.location.href = "./PremiumUsersUI/premium.html";

      axios
        .post(
          "http://localhost:5000/transaction/detail",
          { orderId: orderId, paymentId: paymentId },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(()=>{console.log('in post section of razorpay!!!!')})
        .catch((err) => {
          console.log(err);
        });
    },
    theme: {
      color: "#3399cc",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.on("payment.failed", function (response) {
    alert(response.error.description);
  });
  rzp1.open();
  e.preventDefault();
});

document.getElementById('logout__btn').addEventListener('click', () => {
  window.location.href='../signUp-logInUI/login.html'
  localStorage.removeItem('token');
})

