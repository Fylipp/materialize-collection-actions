var MaterializeCollectionActions = (function () {
    var collections = {};

    function getActions(actionParent) {
        return $(actionParent).find('.mca-action');
    }

    function getAction(actionParent, iconName) {
        var actions = getActions(actionParent);

        if (iconName === undefined) {
            return actions.first();
        } else {
            return actions.filter(function (i, element) {
                return $(element).text() === iconName;
            });
        }
    }

    function addActionToElement(collectionItem, collection, iconName, onClick) {
        return $('<i class="mca-action material-icons right"></i>')
            .appendTo(collectionItem)
            .text(iconName)
            .on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (!$(this).hasClass('disabled')) {
                    onClick(collectionItem, collection);
                }
            });
    }

    var textAttribute = 'data-mca-text';

    return {
        textAttribute: textAttribute,

        configureActions: function (collection, actions) {
            $(collection).each(function () {
                var self = this;

                function process(collectionItem) {
                    var jElement = $(collectionItem);

                    jElement.attr(textAttribute, jElement.text());
                    jElement.text("");

                    actions.forEach(function (action) {
                        addActionToElement(collectionItem, self, action.name, action.callback);
                    });
                }

                var observer = new MutationObserver(function (mutations, observer) {
                    mutations.filter(function (mutation) {
                        return mutation.type === 'childList';
                    }).forEach(function (mutation) {
                        mutation.addedNodes.forEach(function (node) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                process(node);
                            }
                        });
                    });
                });

                observer.observe(this, {childList: true});

                $(this).children().each(function (i, initialItem) {
                    process(initialItem);
                });

                collections[this] = {
                    observer: observer,
                    actions: actions
                };
            });
        },

        removeActions: function (collection) {
            var jCollection = $(collection);

            jCollection.find('.mca-action').remove();
            jCollection.each(function () {
                collections[this].observer.disconnect();
                delete collections[this];
            });
        }
    };

})();
