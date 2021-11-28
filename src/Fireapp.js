import React from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider

} from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import { useState } from "react";
import './Fireapp.css';
import { signOut } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";





const auth = getAuth(firebaseConfig);


const Fireapp = () => {
  const provider = new GoogleAuthProvider();

  const [user, setUser] = useState({


    userInfo: false,

    name: "",

    email: "",

    Password: "",

    error:"", // use for error message ;

    success :"", // use for success message ;

    photo: ""
  });

  const handleFormSubmit = (e) => {

    /* console.log(user.Email , user.Password);*/
    if (user.Email && user.Password) {


      /*console.log('Submitting')*/

      /* user created with email and password  " code use from firebase website " Authentication WEB then password Authentication */

      createUserWithEmailAndPassword(auth, user.Email, user.Password)

        .then((userCredential) => {
          // Signed in 
          //const user = userCredential.user;

          const newUserInfo ={...user};
          newUserInfo.error =''; // error message make null ;
          newUserInfo.success = true; // message of user created successfuly ;
          setUser(newUserInfo);

        
        })
        .catch(error => {
          const newUserInfo = {...user};

          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);

        });

      





    }
    e.preventDefault();

  }


  const handleChange = (e) => {

    console.log(e.target.name, e.target.value);


    let isFormvalid = true;


    if (e.target.name === 'Email') {

      isFormvalid = /\S+@\S+\.\S+/.test(e.target.value);

      console.log(isFormvalid)


    }


    if (e.target.name === 'Password') {

      const isPasswordValied = e.target.value.length > 6;

      const PasswordHNumber = /\d{1}/.test(e.target.value);

      isFormvalid = isPasswordValied && PasswordHNumber

    }

    if (isFormvalid) {

      const newUserInfo = { ...user };

      newUserInfo[e.target.name] = e.target.value;

      setUser(newUserInfo);

    }



  }
  const handlesigninClick = () => {


    signInWithPopup(auth, provider)

      /*console.log('Click me ');*/

      .then((res) => {
        const { displayName, photoURL, email } = res.user;

        const signedInuser = {

          userInfo: true,
          name: displayName,

          email: email,
          photo: photoURL
        };

        setUser(signedInuser);

        /*console.log(displayName, email, photoURL);*/

      })

      .catch(err => {


      })
  };

  const handlesignoutClick = () => {



    /*console.log('Click sign Out')*/

    signOut(auth)

      .then(res => {

        const signOutUser = {

          userInfo: false,
          name: "",
          email: "",
         
          photo: ""

        }

        setUser(signOutUser);

      }).catch(err => {

      })
  }

  return (
    <div className="Info" >
      {
        user.userInfo ? <button onClick={handlesignoutClick}>Sign out</button> :
          <button onClick={handlesigninClick}>Sign-In</button>

      }
      {

        user.userInfo &&


        <div >

          <p >Welcome , GoogleAuthentication Website , NAME : {user.name}</p>
          <p> Email Address is : {user.email}</p>
          <img src={user.photo} alt="" />



        </div>

      }
      <h1 className="Text"> Our  Authintication System</h1>



      <form onSubmit={handleFormSubmit}>

        <input type="text" name="Email" onBlur={handleChange} placeholder="Enter Your Email" required />

        <br />
        <br />

        <input type="Password" name="Password" onBlur={handleChange} placeholder="Password" required />

        <br />
        <br />


        <input type="Submit" value="submit" />

      </form>

      <p style={{color:'red'}}>{user.error}</p>
      { user.success && <p style={{color:'green'}}>User created Successfuly </p>}
    </div>
  );



};


export default Fireapp;
