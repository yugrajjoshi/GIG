import { useState } from "react"

export default function AuthPage() {

   let [Number,setNumber] = useState(0)
   let [password,sedPassword] = useState("")


    return (
      <main className="flex w-full h-screen">
        <div className="flex bg-white  justify-center items-center w-[90%] h-[95%] m-auto rounded-2xl " >
        
        <div className="flex flex-col justify-between items-center w-125 h-[95%] rounded-2xl shadow-2xl overflow-hidden">
  {/* Top Logo Section (takes 40% or fixed height) */}
  <div className="flex justify-center items-center w-full h-2/7">
    <img src="src/assets/logo.svg" className="w-40 h-40" alt="logo" />
  </div>

  {/* Bottom Form Section: Use flex-1 to fill the remaining space */}
  <div className="flex-1 w-full flex flex-col justify-center items-center ">
    <div className=" flex flex-row justify-center w-full h-full">
      <form className="flex flex-col p-4  w-full  items-center  gap-4" >
        <label className="text -ml-60 -mb-2  " >Phone No.</label>
        <input type="number"
           className="w-80 border border-gray-300 rounded-md p-2" />

        <label className="text -ml-62 -mb-2 " >Password</label>
        <input type="password" className="w-80 border border-gray-300 rounded-md p-2"
         />
          <br/>
        <button type="submit" className="w-80 shadow-lg hover:bg-orange-300 hover:scale-105 transition-all duration-300  bg-orange-400 rounded-md p-2">Login</button>
        <a href="" className="text-sm text-gray-600 hover:text-blue-400 ">Forgot Password?</a> 
        <h5>Don't have an account? <a href="" className="text-sm text-gray-600 hover:text-blue-400 ">Register</a></h5>
      </form>
    </div>
  </div>
</div>

        </div>
          
      </main>


    )
}