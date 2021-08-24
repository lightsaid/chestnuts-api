

  // 随机10位字符串
  const GetRandomString = () => {
    let stringes = "1234567890qwertyuiopasdfghjklzxcvbnm".split("")
    let temp = ''
    for(let i=0;i<10; i++){
        // index 区间 [0, stringes.length)
        let index = Math.floor(Math.random() * (stringes.length - 0)); 
        temp += stringes[index]
    }
    return temp
  }

  module.exports = {
    GetRandomString
  }