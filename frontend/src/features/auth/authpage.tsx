


export default function AuthPage() {
    return (
      <main className="flex bg-amber-50 w-full h-screen">
        <div className="flex bg-white  justify-center items-center border w-[90%] h-[90%] m-auto rounded-2xl " >
        
        <div className="flex flex-col border justify-between items-center w-125 h-[95%] rounded-2xl shadow-2xl overflow-hidden">
  {/* Top Logo Section (takes 40% or fixed height) */}
  <div className="flex justify-center items-center w-full border-b h-2/7">
    <img src="src/assets/logo.svg" className="w-40 h-40" alt="logo" />
  </div>

  {/* Bottom Form Section: Use flex-1 to fill the remaining space */}
  <div className="flex-1 w-full flex flex-col justify-center items-center p-4">
    <div className=" flex flex-row justify-center items-center w-full h-full">
      <h1>Login</h1>
    </div>
  </div>
</div>

        </div>
          
      </main>


    )
}