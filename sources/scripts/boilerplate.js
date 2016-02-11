const Api = 'http://www.freecodecamp.com/news/hot';
const Hooks = {
	loader: $('.loader'),
	warning: $('.warning'),
	articles: $('.articles')
};
const Notifications = {
	warning: 'API could not be reached. Data was not loaded. Sorry :('
};
const Proto = {
	Article: (title, link, op, opLink, opAvatar, upvotes, id) => {
		let element = '<div class="article" data-id="' + id + '">';
		element += '<div class="upvotes"><span>' + upvotes + '</span></div>';
		element += '<div class="article-wrapper">';
		element += '<h3><a href="' + link + '" target="_blank">' + title + '</a></h3>';
		element += '<p>';
		element += '<span class="avatar" style="background-image: url(\'' + opAvatar + '\')"></span>';
		element += '<a href="' + opLink + '" class="op" target="_blank">' + op + '</a>';
		element += '</p>';
		element += '</div></div>';
		return element;
	},
	DateArticles: (title, configurableId) => {
		let element = '<h2>' + title + '</h2>';
		element += '<div id="' + configurableId + '">';
		element += '</div></div>';
		return element;
	}
};
const ShowWarning = (hook, message) => {
	hook.hide();
	hook.html(message);
	hook.fadeIn();
}
const ConstructArticles = (headingTitle, headingId, dataArr) => {
	Hooks.articles.append(Proto.DateArticles(headingTitle, headingId));
	let articleWrapper = $('#'+headingId);
	dataArr.map((articleObject) => {
		articleWrapper.append(Proto.Article(
			articleObject.headline,
			articleObject.link,
			articleObject.author.username,
			'http://www.freecodecamp.com/'+articleObject.author.username,
			articleObject.author.picture,
			articleObject.rank,
			articleObject.id
		));
	});
};

$.getJSON(Api, (data) => {

	let articles = {};

	articles.fresh = data.filter((articleObject) => {
		let today = Date.now();
		return articleObject.timePosted === today;
	});

	articles.stale = data.filter((articleObject) => {
		let today = Date.now();
		return articleObject.timePosted < today;
	});

	articles.stale.sort((low, high) => {
		return high.rank - low.rank;
	})

	if (articles.fresh.length > 0) {
		ConstructArticles('Today', 'today', articles.fresh);
	}

	if (articles.stale.length > 0) {
		ConstructArticles('Older', 'older', articles.stale);
	}

}).done(() => {
	Hooks.loader.hide();
	Hooks.articles.fadeIn();
}).fail(() => {
	Hooks.loader.hide();
	ShowWarning(Hooks.warning, Notifications.warning);
});
