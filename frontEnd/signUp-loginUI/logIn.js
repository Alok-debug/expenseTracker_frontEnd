const form = document.getElementById("form__login");

function notifyUser(message) {
  const container = document.getElementById("container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerHTML = `<h4>${message}</h4>`;
  container.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 1500);
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email=document.getElementById('email')
    const password=document.getElementById('password')
    const obj={ 
        email:email.value,
        password:password.value
    }

    email.value=''
    password.value=''
    axios.post('http://localhost:5000/user/login',obj)
        .then(res => {
        notifyUser(res.data.message);
        localStorage.setItem('token', `${res.data.token}`);
          if (res.data.isPremium) {
              window.location.href = '../PremiumUsersUI/premium.html';
          }
          else {
              window.location.href = '../non-premiumUsersUI/index.html';
          }
    })
        .catch(err => {
            notifyUser(err.response.data.message);
           
        //   if (err.response.data.message === 'Incorrect Password') {
        //     let parent = document.getElementsByClassName('signUp__form')[0];
        //     const childText=`<h3 style="color:red; font-weight:bolder; background:black;">${err.response.data.message}: Try again or reset your password </h3>`
        //       parent += childText;
              
        // }
    })
})



//anchor link
const forgotPassword=document.getElementById('forgotPassword')
forgotPassword.addEventListener('click',()=>{
    document.body.innerHTML=`
        <div id="FPdiv" style="display:flex; flex-direction:column; margin-top:10rem; align-items:center; justify-content:center;">
            <h3>Enter Your Email</h3>
            <form id="FPform">
            <label for="FPemail">Email Address:</label>
            <input type="email"  id="FPemail" name="email" required>
            <br><br>
            <button type="submit" style="cursor:pointer;">Submit</button>
            </form>
        </div>
    `
    const FPform=document.getElementById('FPform')
    FPform.addEventListener('submit',(e)=>{
        e.preventDefault()
        const emailInput=document.getElementById('FPemail')
        const email=emailInput.value
        emailInput.value=''
        ////for sendgrid
        // const div=document.createElement('div')
        // div.innerHTML=`
        //   <p>Password Reset link sent to your Email</p> 
        //   <a href="">Login Now </a>
        // `
        // document.getElementById('FPdiv').appendChild(div)
        axios.post('http://localhost:5000/forgot/password',{email:email})
        .then(response=>{
            if(!response.data.success){
            alert(response.data.message)
            window.location.href="./signUp.html"
            }
            else{
                alert(response.data.message)
                window.location.href=""
            }

        })
        .catch(err=>{
            console.log(err)
        })
    })
})