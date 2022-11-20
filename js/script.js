'use strict';

const opts = {
    tagSizes: {
        count: 5,
        classPrefix: 'tag-size-',
    },
};

const select = {
    all: {
        articles: '.post',
        linksTo: {
            tags: 'a[href^="#tag-"]',
            authors: 'a[href^="#author-"]',
        },
    },
    article: {
        title: '.post-title',
        author: '.post-author',
        tags: '.post-tags .list',
    },
    listOf: {
        titles: '.titles',
        tags: '.tags.list',
        authors: '.authors.list',
    },
    rightMenu: {
        tags: '[class^="list tags"]',
        authors: '[class^="list authors"]',
    }
};

function titleClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }
    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');
    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
}

function generateTitleLinks(customSelector = '') {
    /* remove contents of titleList */
    const titleList = document.querySelector(select.listOf.titles);
    titleList.innerHTML = '';
    /* for each article */
    const articles = document.querySelectorAll(select.all.articles + customSelector);
    for (let article of articles) {
        /* get the article id */
        const articleId = article.getAttribute('id');
        /* find the title element */
        const titleElement = article.querySelector(select.article.title);
        /* get the title from the title element */
        const articleTitle = titleElement.innerHTML;
        /* create HTML of the link */
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
        /* insert link into titleList */
        titleList.insertAdjacentHTML('beforeend', linkHTML);
    }
    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
        link.addEventListener('click', titleClickHandler);
    }
}

function calculateTagsParams(tags) {
    let params = {
        min: 999999,
        max: 0,
    }
    for (let tag in tags) {
        if (tags[tag] > params.max) {
            params.max = tags[tag];
        }
        if (tags[tag] < params.min) {
            params.min = tags[tag];
        }
    }
    return params;
}

function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);

    return opts.tagSizes.classPrefix + classNumber;
}

function generateTags() {
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(select.all.articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
        /* find tags wrapper */
        const tagList = article.querySelector(select.article.tags);
        let html = '';
        const articleTags = article.getAttribute('data-tags');
        /* split tags into array */
        const articleTagsArray = articleTags.split(' ');
        /* START LOOP: for each tag */
        for (let tag of articleTagsArray) {
            /* generate HTML of the link */
            /* add generated code to html variable */
            const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
            html = html + linkHTML + '\n';
            if (!Object.prototype.hasOwnProperty.call(allTags, tag)) {
                allTags[tag] = 1;
            } else {
                allTags[tag]++;
            }
        }
        tagList.insertAdjacentHTML('beforeend', html);
    }
    const tagListMenu = document.querySelector(select.rightMenu.tags);
    const tagsParams = calculateTagsParams(allTags);
    let allTagsHtml = '';
    for (let tag in allTags) {
        allTagsHtml += '<li class="' + calculateTagClass(allTags[tag], tagsParams) + '"> ' +
            '<a href="#tag-' + tag + '">' + tag + '</a>' +
            ' (' + allTags[tag] + ')</li>';
    }
    tagListMenu.innerHTML = allTagsHtml;
}

function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
        /* remove class active */
        activeTagLink.classList.remove('active');
    }
    /* END LOOP: for each active tag link */
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinksWithHref = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let tagLinkWithHref of tagLinksWithHref) {
        /* add class active */
        tagLinkWithHref.classList.add('active');
    }
    /* END LOOP: for each found tag link */
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
    const links = document.querySelectorAll('.post-tags a');
    for (let link of links) {
        link.addEventListener('click', tagClickHandler);
    }
    const rightMenulinks = document.querySelectorAll('.list.tags a');
    for (let link of rightMenulinks) {
        link.addEventListener('click', tagClickHandler);
    }
}

function generateAuthors() {
    let allAuthors = {}
    const articles = document.querySelectorAll(select.all.articles);
    for (let article of articles) {
        const authorWrapper = article.querySelector(select.article.author);
        const author = article.getAttribute('data-author');
        const html = 'by <a href="#author-' + author + '">' + author + '</a>';
        authorWrapper.innerHTML = html;
        if (!Object.prototype.hasOwnProperty.call(allAuthors, author)) {
            allAuthors[author] = 1;
        } else {
            allAuthors[author]++;
        }
        
    }
    let allAuthorsHtml = '';
    const authorsListMenu = document.querySelector(select.rightMenu.authors);
    for (let author in allAuthors) {
        allAuthorsHtml += '<li><a href="#author-' + author + '">' + author + '</a>' +
        ' (' + allAuthors[author] + ')</li>';
    }
    authorsListMenu.innerHTML = allAuthorsHtml;
}

function authorClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
    for (let activeAuthorLink of activeAuthorLinks) {
        activeAuthorLink.classList.remove('active');
    }
    const authorLinksWithHref = document.querySelectorAll('a[href="' + href + '"]');
    for (let authorLinkWithHref of authorLinksWithHref) {
        authorLinkWithHref.classList.add('active');
    }
    generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
    const links = document.querySelectorAll('.post-author a');
    for (let link of links) {
        link.addEventListener('click', authorClickHandler);
    }
    const rightMenulinks = document.querySelectorAll('.list.authors a');
    for (let link of rightMenulinks) {
        link.addEventListener('click', authorClickHandler);
    }
}

generateTitleLinks();
generateTags();
generateAuthors();
addClickListenersToTags();
addClickListenersToAuthors();
