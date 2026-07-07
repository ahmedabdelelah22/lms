const Nav = ({title}) => {
  return (
       <nav className="sticky top-0 z-50 bg-gray-100 border-b border-gray-200 px-4 py-3 flex flex-col items-start gap-4 ">
        <div className="flex  items-center gap-2 text-xs text-gray-400">
          <span>Home</span><span>&gt;</span><span>Courses</span><span>&gt;</span>
          <span className="text-gray-700 font-medium">Course Details</span>
        </div>
        
  {/* Course Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{title}</h1>
          </div>
      </nav>
  )
}

export default Nav;