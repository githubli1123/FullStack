var TooltipDiv = (function () {
  var isInit = false;
  function _() {}
  _.initTool = function () {
    if (isInit) {
      return;
    }
    var div = document.getElementById("toolTip");
    this._div = div;
    isInit = true;
  };

  _.hide = function (visible) {
    if (!isInit) {
      return;
    }
    this._div.style.display = visible ? "block" : "none";
  };

  /*
    position屏幕坐标
    显示在屏幕上
    */
  _.show = function (position, message) {
    if (!isInit) {
      return;
    }
    if (position && message) {
      this.hide(true);
      this._div.innerHTML = message;
      this._div.style.position = "absolute";
      this._div.style.left = position[0] + 30 + "px";
      this._div.style.top = position[1] - this._div.clientHeight / 2 + "px";
    }
  };

  _.distory = function () {
    this._div.style.display = "none";
    isInit = false;
  };
  return _;
})();

export default TooltipDiv;
