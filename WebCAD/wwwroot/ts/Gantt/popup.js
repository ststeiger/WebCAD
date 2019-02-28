var Popup = (function () {
    function Popup(parent, custom_html) {
        this.parent = parent;
        this.custom_html = custom_html;
        this.make();
    }
    Popup.prototype.make = function () {
        this.parent.innerHTML = "\n            <div class=\"title\"></div>\n            <div class=\"subtitle\"></div>\n            <div class=\"pointer\"></div>\n        ";
        this.hide();
        this.title = this.parent.querySelector('.title');
        this.subtitle = this.parent.querySelector('.subtitle');
        this.pointer = this.parent.querySelector('.pointer');
    };
    Popup.prototype.show = function (options) {
        if (!options.target_element) {
            throw new Error('target_element is required to show popup');
        }
        if (!options.position) {
            options.position = 'left';
        }
        var target_element = options.target_element;
        if (this.custom_html) {
            var html = this.custom_html(options.task);
            html += '<div class="pointer"></div>';
            this.parent.innerHTML = html;
            this.pointer = this.parent.querySelector('.pointer');
        }
        else {
            this.title.innerHTML = options.title;
            this.subtitle.innerHTML = options.subtitle;
            this.parent.style.width = this.parent.clientWidth + 'px';
        }
        var position_meta;
        if (target_element instanceof HTMLElement) {
            position_meta = target_element.getBoundingClientRect();
        }
        else if (target_element instanceof SVGElement) {
            position_meta = options.target_element.getBBox();
        }
        if (options.position === 'left') {
            this.parent.style.left =
                position_meta.x + (position_meta.width + 10) + 'px';
            this.parent.style.top = position_meta.y + 'px';
            this.pointer.style.transform = 'rotateZ(90deg)';
            this.pointer.style.left = '-7px';
            this.pointer.style.top = '2px';
        }
        this.parent.style.opacity = 1;
    };
    Popup.prototype.hide = function () {
        this.parent.style.opacity = 0;
    };
    return Popup;
}());
export default Popup;
