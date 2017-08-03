var gulp = require("gulp")
var gutil = require("gulp-util")  
var combiner = require("stream-combiner2")
var sourcemaps = require("gulp-sourcemaps")
var watchPath = require('gulp-watch-path')
var autoprefixer = require('gulp-autoprefixer')  // 浏览器前缀


// gulp.task(name,fn) -- 定义任务，第一个参数是任务名，第二个参数是任务内容；
// gulp.src(path)     -- 选择文件，传入参数是文件路径；
// gulp.dest(path)    -- 输出文件；
// gulp.pipe()        -- 管道，你可以暂时将pipe理解为将操作加入执行队列；
// 详解gulp可以查看官网文档    http://www.gulpjs.com.cn/docs/api/


// 让命令行输出的文字带颜色； 
var handleError = function(err){
	var colors = gutil.colors
	consoel.log("\n")
	gutil.log(colors.red("error!"))
	gutil.log("fileName:"+colors.red(err.fileName))
	gutil.log("lineNumber:"+colors.red(err.lineNumber))
	gutil.log("message:"+err.message)
	gutil.log("plugin:"+colors.yellow(err.plugin))
}


// 一、压缩html文件
var htmlmin = require("gulp-htmlmin")
gulp.task("watchhtml",function(){
	gulp.watch("src/html/**/*.html",function(event){
		var paths = watchPath(event,"src","dist")
		gutil.log(gutil.colors.green(event.type)+" "+paths.srcPath)
		gutil.log("Dist"+paths.distPath)

		var combined = combiner.obj([
			gulp.src(paths.srcPath),
			// sourcemaps.init(),
			htmlmin(),
			// sourcemaps.write("./")
			gulp.dest(paths.distDir)
			])
		combined.on("error",handleError)
	})
})
// 一次性编辑所有的html
gulp.task("htmlmin",function(){
	var options = {
		collapseWhitespace: true,
		removeComments: true,
		removeEmptyAttributes: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		minifyJS: true,
		minifyCSS: true
	};
	gulp.src("src/html/*.html")
	.pipe(htmlmin(options))
	.pipe(gulp.dest("dist/html/"));
})


// 二、配置js；
var uglify = require("gulp-uglify")  // 依赖gulp-uglify;

gulp.task("watchjs",function(){
	gulp.watch("src/js/**/*.js",function(event){
		var paths = watchPath(event,"src/","dist/")
		gutil.log(gutil.colors.green(event.type)+" "+paths.srcPath)
		gutil.log("Dist"+paths.distPath)
		var combined = combiner.obj([
			gulp.src(paths.srcPath),
			sourcemaps.init(),
			uglify(),
			sourcemaps.write("./"),
			gulp.dest(paths.distDir)
			])
		combined.on("error",handleError)
	})
})


// 一次编译所有js文件；
gulp.task("uglifyjs",function(){
	var combined = combiner.obj([
		gulp.src("src/js/**/*.js"),
	//	sourcemaps.init(),
		uglify(),
	//	sourcemaps.write("./"),
		gulp.dest("dist/js/")
		])
	combined.on("error",handleError)
})



// 三、配置css；
var minifycss = require("gulp-clean-css")
gulp.task("watchcss",function(){
	gulp.watch("src/css/**/*.css",function(event){
		var paths = watchPath(event,"src/","dist/")
		gutil.log(gutil.colors.green(event.type)+" "+paths.srcPath)
		gutil.log("Dist"+paths.distPath)
		gulp.src(paths.srcPath)
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			browsers:"last 2 versions"
		}))
		.pipe(minifycss({compatibility:"ie8"}))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest(paths.distDir))
	})
})

// 一次性编译所有的css文件；
gulp.task("minifycss",function(){
	gulp.src("src/css/**/*.css")
	// .pipe(sourcemaps.init())
	.pipe(autoprefixer({
		browsers:"last 2 versions"
	}))
	.pipe(minifycss({compatibility:"ie8"}))
	// .pipe(sourcemaps.write("./"))
	.pipe(gulp.dest("dist/css"))
})




// 配置less
var less =require("gulp-less")
gulp.task("watchless",function(){
	gulp.watch("src/less/**/*.less",function(event){
		var paths = watchPath(event,"src/less/","dist/css")
		gutil.log(gutil.colors.green(event.type)+" "+paths.srcPath)
		gutil.log("Dist"+paths.distPath)
		var combined =combiner.obj([
			gulp.src(paths.srcPath),
			sourcemaps.init(),
			autoprefixer({
				browsers:"last 2 versions"
			}),
			less(),
			minifycss({compatibility:"ie8"}),
			sourcemaps.write("./"),
			gulp.dest(paths.distDir)
			])
		combined.on("error",handleError)
	})
})

// 一次性编辑所有less文件;
gulp.task("lesscss",function(){
	var combined =combiner.obj([
		gulp.src("src/less/**/*.less"),
		// sourcemaps.init(),
		autoprefixer({
			browsers:"last 2 versions"
		}),
		less(),
		minifycss({compatibility:"ie8"}),
		// sourcemaps.write("./"),
		gulp.dest("dist/css")
		])
	combined.on("error",handleError)
})



// 配置image
var imagemin = require("gulp-imagemin")
gulp.task("watchimage",function(){
	gulp.watch("src/images/**/*",function(event){
		var paths = watchPath(event,"src/","dist/")
		gutil.log(gutil.colors.green(event.type)+" "+paths.srcPath)
		gutil.log("Dist"+paths.distPath)
		gulp.src(paths.srcPath)
		.pipe(imagemin({
			progressive:true
		}))
		.pipe(gulp.dest(paths.distPath))
	})
})

// 一次性压缩所有images
gulp.task("image",function(){
	gulp.src("src/images/**/*")
	.pipe(imagemin({
		progressive:true
	}))
	.pipe(gulp.dest("dist/images"))
})




// 配置文件复制
gulp.task("watchcopy",function(){
	gulp.watch("src/fonts/**/*",function(event){
		var paths = watchPath(event)
		gutil.log(gutil.colors.green(event.type)+" " +paths.srcPath)
		gutil.log("Dist"+paths.distPath)
		gulp.src(paths.srcPath)
		.pipe(gulp.dest(paths.distDir))
	})
})

// 一次性复制所有common文件夹下的所有文件
gulp.task("commoncopy",function(){
	gulp.src("src/common/**")
	.pipe(gulp.dest("dist/common/"))
})





// 合并css文件；
var spriter = require('gulp-css-spriter')   // 雪碧图
var concat  = require("gulp-concat");
gulp.task("concatCss",function(){
	gulp.src("src/css/**/*.css")
	.pipe(concat("all.css" ,{newLine:"这里是分割线"}))
	.pipe(spriter({
		"spriteSheet":"dest/images/spritesheet.png",   // 生成的路径，这里是精灵图生成的路径 和名称。根据自己的项目自定义
		"pathToSpriteSheetFromCSS": "src/images/spritesheet.png"  //替换的路径  这里是把原来引入的背景图路径替换成这个
	}))

.pipe(minifycss({compatibility:"ie8"}))   // 或者 .pipe(minifycss())
.pipe(gulp.dest("dist/css/"))
})

// 合并js
gulp.task("concatJs",function(){
	gulp.src("src/js/**/*.js")
	.pipe(concat("all.js"))
	.pipe(uglify())
	.pipe(gulp.dest("dist/js/"))
})



// 默认任务执行
gulp.task("default",["watchjs","watchcss","watchless","watchimage","watchhtml"])
gulp.task("dist",["htmlmin","uglifyjs","minifycss","lesscss","commoncopy","image"])