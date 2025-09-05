import jwt from "jsonwebtoken";
import bcrypt from"bcryptjs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const userFile=path.join("data","users.json");
const readUsers=()=>JSON.parse(fs.readFileSync(userFile,"utf-8"));
const writeUsers=(data)=>fs.writeFileSync(userFile,JSON.stringify(data,null,2));


export const register=(req,res)=>{
    const {username,password}=req.body;
    const users=readUsers();

    if(users.find((u)=>u.username==username)){
        return res.status(400).json({error:"User Already exists"});
    };

    const hashedpassword=bcrypt.hashSync(password,10);
    const newUser={
        id:`USR-${Date.now()}`,
        username,
        password:hashedpassword
    };
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({message:"User added successfully"});    
};

export const login = (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find((u) => u.username === username);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
};
