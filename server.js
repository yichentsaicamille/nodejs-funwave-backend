const express = require("express");
require("dotenv").config();

// path 是 nodejs 內建的 lib
const path = require("path");
const cors = require("cors");
const expressSession = require("express-session");

let app = express();

app.use(
  cors({
    //為了要讓 browser 在 CORS 的情況下還是幫我們送 cookie，可以設陣列(好幾個)
    origin: ["http://localhost:3000"], //誰發出來的 前端(只有這個前端網址才能傳過來)
    credentials: true, //set cookie才會生效
  })
);
//解析body資料，將傳入的請求對象識別為string或array // extended: false -> querystring ,extended: true -> qs
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 抓圖路徑範例：http://localhost:3002/img/products/funboard001B-1.jpg
app.use(express.static(path.join(__dirname, "public")));

//啟用session，預設存在記憶體
let FileStore = require("session-file-store")(expressSession);
app.use(
  expressSession({
    store: new FileStore({ path: path.join(__dirname, "..", "sessions") }),
    //正式環境中會放在 /tmp/sessions檔案夾裡
    //目前資料夾的上層，進入sessions資料夾內，放在funwave-be外nodemon才不會重啟
    secret: process.env.SESSION_SECRET, //session加密
    resave: false, //每次資料重傳，就算資料沒改也重存
    saveUninitialized: false,
  })
);

// 匯入所需Router
let authRouter = require("./routers/auth");
app.use("/api/auth", authRouter);

let memberRouter = require("./routers/member");
app.use("/api/member", memberRouter);

let productsRouter = require("./routers/products");
app.use("/api/products", productsRouter);

let cartProductsRouter = require("./routers/cartProducts");
app.use("/api/cartProducts", cartProductsRouter);

let courseRouter = require("./routers/course");
app.use("/api/course", courseRouter);

let customizedRouter = require("./routers/customized");
app.use("/api/customized", customizedRouter);

let surfspotRouter = require("./routers/surfspot");
app.use("/api/surfspot", surfspotRouter);

let homeRouter = require("./routers/home");

let informationRouter = require("./routers/information");

app.use("/api/home", homeRouter);

app.use("/api/information", informationRouter);

let collectRouter = require("./routers/collect");
app.use("/api/collect", collectRouter);

let recommendRouter = require("./routers/recommend");
app.use("/api/recommend", recommendRouter);

app.use((req, res, next) => {
  console.log("在所有路由中間件的後面 -> 404");
  res.status(404).send("Not Found");
});
app.use((err, req, res, next) => {
  console.log("最後錯誤處理中間件", err);
  res.status(500).send("Server 錯誤: 請洽系統管理員");
});
const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
