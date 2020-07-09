const router = require("express").Router(),
            ejs = require("ejs");

router.get("/docs", (req, res)=>{
    res.render("documentation.ejs")
});

module.exports = router;