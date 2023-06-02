
const DomFuncs = {
    clearChildren: function(element) {
        while (element.children.length) {
            element.removeChild(element.lastChild)
        }
    },

    makeElement: function(type, text, clas) {
        const e = document.createElement(type);
        if (text) {
            e.textContent = text
        }
        if (clas) {
            if (Array.isArray(clas)) {
                for (const c of clas) {
                    if (c) e.classList.add(c)
                }
            }
            else {
                e.classList.add(clas)
            }
        }

        return e
    }
}

module.exports = DomFuncs
