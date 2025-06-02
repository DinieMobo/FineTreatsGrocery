const isAdmin = (role)=>{
    if(!role) return false
    return role.toLowerCase() === 'admin'
}

export default isAdmin