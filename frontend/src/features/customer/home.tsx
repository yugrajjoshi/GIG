import logo from "../../assets/logo.svg";

export default function CustomerHome() {

    

    return (
        <>
        <main className="w-full h-screen  border flex">
            <div className=" flex w-full h-full  border "  >
                <div className=" flex w-full justify-between  p-1 h-20">
                    <img src={logo} className="w-1/5  "/>
                    <div className=" flex items-center justify-center w-3/5" >
                    <input type="text" placeholder="    What help are you looking for?" className="w-full h-13 rounded-full shadow-lg p-2  " />
                    </div>
                    <div className="w-1/5  flex items-center justify-center">
                    <button className="w-15 h-15 rounded-full shadow-2xl " >
                        { <img /*src={}*//>}
                        </button></div>
                </div>
                <div></div>
                <div></div>
            </div>
        </main>
        </>
    )
}