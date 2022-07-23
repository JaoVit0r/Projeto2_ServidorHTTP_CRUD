const http = require('http')
const fs = require('fs')

const readDatabase = async (callback) => {
    try {
        const buffer = await fs.promises.readFile("./db.json")
        const database = JSON.parse(buffer.toString())
        callback(database)
    } catch (error) {
        console.error(error)
    }
}

const server = http.createServer((req, res) => {
    const {url, method} = req
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'text/json;charset=utf-8')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')    
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader('Access-Control-Allow-Credentials', true)   
    res.setHeader("Access-Control-Max-Age", 2592000) 
    console.log(url, method);
    if (url === '/') {
        switch (method) {
            case 'GET':
                return readDatabase((db) => {                   
                    res.end(JSON.stringify(db))
                })          
                case 'POST':
                    return readDatabase((db) => {
                        req.on('data', new_register => {
                            new_register = JSON.parse(new_register);
                            new_register.id = Math.random();
                            db.data.push(new_register);
                            fs.promises.writeFile("./db.json", JSON.stringify(db));
                            res.end(`Posted!`);
                        })
                    })                
                case 'PUT':
                return readDatabase((db) => {
                    req.on('data', update_register => {
                        update_register = JSON.parse(update_register)             
                        const CPF = update_register.CPF    
                        const register_cpfx = db.data.findIndex((register) => {
                            return register.CPF === CPF
                        })
                        db.data[register_cpfx].nome = update_register.nome                     
                        db.data[register_cpfx].CPF = update_register.CPF                     
                        db.data[register_cpfx].telefone = update_register.telefone                     
                        db.data[register_cpfx].email = update_register.email                     
                        fs.promises.writeFile("./db.json", JSON.stringify(db))    
                        res.end(`Updated!`)
                    })
                })                
                case 'DELETE':    
                    return readDatabase((db) => {                    
                        req.on('data', registerId => {
                            registerId = JSON.parse(registerId)
                            const register = db.data.find(obj => obj.id === parseFloat(registerId.id))                                            
                            if(register != -1 || typeof(register) != "undefined"){   
                                db.data.splice(db.data.indexOf(register), 1)                        
                                }
                            fs.promises.writeFile("./db.json", JSON.stringify(db))
                            return res.end(`Deleted!`)               
                        })                    
                    })
                case 'OPTIONS':
                    res.writeHead(204)
                    res.end('Erro')
                    return
            default:
                break
        }

        res.writeHead(404)
        res.end('Falha na conexão!')
    }
})

server.listen(3000, 'localhost', () => {
    const address = server.address()
    console.log(`Servidor rodando ${address.address}:${address.port}`)
})