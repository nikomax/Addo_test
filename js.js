/**
 * Created by maksc on 11.09.2017.
 */
var xhr = new XMLHttpRequest();
var gallery = document.querySelector(".gallery");
var pagination = document.querySelector(".pagination");
var size = document.querySelector(".size");
var preview = document.querySelector(".overlay");
var previewImg = document.querySelector(".preview__img");
var authorList = document.querySelector(".author__list");
var authorItem = 0;

function chunk(arr, size) {
    var result = [];
    for (var j = 0; j < arr.length; j += size) {
        result.push(arr.slice(j, j + size));
    }
    return result;
}

function unique(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (!newArr.includes(arr[i])){
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

function createPage(arr) {
    for (var n = 0; n < arr.length; n++) {
        var page = document.createElement('li');
        page.classList.add('page__item');
        page.innerHTML = `<a class="page__link" href=${n}>${n + 1}</a>`;
        pagination.appendChild(page);
    }
}

function showDefaultImg(arr) {
    for (var j = 0; j < arr[0].length; j++) {
        var attr = 'https://unsplash.it/200?image=' + arr[0][j];
        var newImg = document.createElement('div');
        newImg.classList.add('gallery__item');
        newImg.innerHTML = `<a class="gallery__link" href="#"><img class="gallery__img" src=${attr}></a>`;
        gallery.appendChild(newImg);
    }
}

function showImg(arr)  {
    gallery.innerHTML = '';
    event.preventDefault();
    var target = event.target;
    var pageNum = target.getAttribute('href');
    for (var j = 0; j < arr[pageNum].length; j++) {
        var attr = 'https://unsplash.it/200?image=' + arr[pageNum][j];
        var newImg = document.createElement('div');
        newImg.classList.add('gallery__item');
        newImg.innerHTML = `<a class="gallery__link" href="#"><img class="gallery__img" src=${attr}></a>`;
        gallery.appendChild(newImg);
    }
}

function heightCondition (a, minHeight, maxHeight) {
    if (a.height > minHeight && a.height < maxHeight) {
        arrId.push(a.id);
        authorArr.push(a.author);
        authorList.appendChild(authorItem);
    }
}

xhr.open('GET', 'https://unsplash.it/list', false);

xhr.send();

if (xhr.status != 200) {

    alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
} else {
    var data = JSON.parse(xhr.response);
    var arrId = [];
    for (var i = 0; i < data.length; i++) {
        arrId.push(data[i].id);
    }
    var chunkedArr = chunk(arrId, 20);
    createPage(chunkedArr);

    showDefaultImg(chunkedArr);

    pagination.onclick = function (event) {
        showImg(chunkedArr);
    };

    size.onclick = function (event) {
        authorList.innerHTML = '';
        gallery.innerHTML = '';
        pagination.innerHTML = '';
        arrId = [];
        authorArr = [];
        var targetLarge = event.target;
        var large = targetLarge.classList.value;
        var sortedAuthorArr = [];
        for (var i = 0; i < data.length; i++) {
            authorItem = document.createElement('li');
            authorItem.classList.add('author__item');
            authorItem.innerHTML = `<a href="#">${data[i].author}</a>`;

            if (!sortedAuthorArr.includes(authorArr[i])){
                sortedAuthorArr.push(authorArr[i]);
                console.log(authorArr[i]);
            }


            if (large === 'small') {
                heightCondition (data[i], 0, 799);
            } else if (large === 'medium') {
                heightCondition (data[i], 800, 1500);
            } else if (large === 'large') {
                heightCondition (data[i], 1500, Infinity);
            }
        }
        // var sortedAuthorArr = unique(authorArr);

        console.log(authorArr);

        chunkedArr = chunk(arrId, 20);

        createPage(chunkedArr);

        showDefaultImg(chunkedArr);

        pagination.onclick = function (event) {
            showImg(chunkedArr);
        }
    };

    gallery.onclick = function (event) {
        event.preventDefault();
        var target = event.target;
        preview.style.display="block";
        var imageSrc = target.getAttribute('src');
        var imageId = imageSrc.substr(30);
        previewImg.setAttribute('src', 'https://unsplash.it/1000/600?image=' + imageId);
        preview.onclick = function () {
            preview.style.display="none";
        }
    }
}