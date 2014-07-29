/*
 * GET home page.
 */

/*-----------------------------------*/
exports.main = function(req,res){
    res.render("main/mian",{title:"主页"});
}
exports.people = function(req,res){
    res.render("people/people",{title:"个人信息"});
}
exports.menus = function(req,res){
    res.render("menu/menu",{"title":"今日菜单"});
}