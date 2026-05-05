const generateRandomInstituteNumber = ()=>{
    const randomNumber = Math.floor(100000 + Math.random() * 900000) // generates a random 6 digit number
    return randomNumber
}

export default generateRandomInstituteNumber