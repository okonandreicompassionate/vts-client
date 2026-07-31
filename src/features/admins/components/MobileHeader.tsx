

const MobileHeader = () => {
  return (
    <div>
        <header className="flex flex-col items-center justify-center gap-4  px-4 py-8 sm:px-6 md:px-16 md:py-12">
            <img src="/logo.svg" alt="" className="w-32 lg:mt-0 lg:-mb-40 lg:ml-40 object-cover" />
            <h2 className="text-2xl font-bold text-slate-800 md:text-3xl lg:ml-3">Visitor Tracker</h2>
        </header>
      
    </div>
  )
}

export default MobileHeader
