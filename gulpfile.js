var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

/*SASS to CSS*/
gulp.task('sass', function() {
    return gulp.src('scss/main.scss') //określenie ścieżki do pliku scss
        .pipe(sourcemaps.init()) //inicjalizacja map kodu źródłowego
        .pipe(sass().on('error', sass.logError)) // wyświetlanie błędów w konsoli
        .pipe(autoprefixer({
            browsers:['last 4 version']
        })) //dodawanie prefixów do przeglądarek -4 ostatnie wersje
        .pipe(sass({outputStyle: 'nested'})) //uruchomienie konwersji sass -> css w formacie skompresowanym
        .pipe(sourcemaps.write()) // dodanie map kodu źródłowego
        .pipe(gulp.dest('css')) // zapis pliku css do folderu css
        .pipe(browserSync.stream()) // synchronizacja przeglądarek
});

/*Watcher*/ // wygląda zawsze tak samo
gulp.task('watch', function(){
    browserSync.init({
        server: ".",
        notify: true,
        open: true //od razu przy wpisaniu gulp watch otworzy się nowa karta w przeglądarce
    });
    //obserwacja SASS
    gulp.watch('scss/**/*.scss', ['sass']);
    //obserwacja HTML
    gulp.watch('./index.html', browserSync.reload);
});
