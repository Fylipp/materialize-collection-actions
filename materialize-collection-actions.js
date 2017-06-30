var MaterializeCollectionActions = (function () {
    var lists = {};

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

    function addActionToElement(listElement, list, iconName, onClick) {
        return $('<i class="mca-action material-icons right"></i>')
            .appendTo(listElement)
            .text(iconName)
            .on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (!$(this).hasClass('disabled')) {
                    onClick(listElement, list);
                }
            });
    }

    var textAttribute = 'data-mca-text';

    return {
        textAttribute: textAttribute,

        configureList: function (list, actions) {
            $(list).each(function () {
                var self = this;

                function process(listElement) {
                    var jElement = $(listElement);

                    jElement.attr(textAttribute, jElement.text());
                    jElement.text("");

                    actions.forEach(function (action) {
                        addActionToElement(listElement, self, action.name, action.callback);
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

                $(this).children().each(function (i, initialElement) {
                    process(initialElement);
                });

                lists[this] = {
                    observer: observer,
                    actions: actions
                };
            });
        },

        releaseList: function (list) {
            var jList = $(list);

            jList.find('.mca-action').remove();
            jList.each(function () {
                lists[this].observer.disconnect();
                delete lists[this];
            });
        }
    };

})();
