sequelize model:generate --name User --attributes fullname:string,dob:string,citizenID:string,passportID:string,address:string,phone:string,companyName:string,username:string,password:string,email:string,maxCamera:integer,credit:float,isActive:boolean

sequelize model:generate --name Camera --attributes uuid:string,key:string,outputSource:string,outputType:string,isActive:boolean

sequelize model:generate --name CameraPrice --attributes price:float

sequelize model:generate --name Promotion --attributes code:string,price:float,noCam:integer,date:string,isActive:boolean

sequelize model:generate --name Admin --attributes email:string,password:string

sequelize seed:generate --name demo-product
