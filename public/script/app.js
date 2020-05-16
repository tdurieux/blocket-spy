angular
  .module("jdbl-website", ["ngRoute", "ngMap", "ngTouch", "angularLazyImg"])
  .config([
    "lazyImgConfigProvider",
    function (lazyImgConfigProvider) {
      var scrollable = document.querySelector(".scrollable");
      lazyImgConfigProvider.setOptions({
        container: angular.element(scrollable), // if scrollable container is not $window then provide it here. This can also be an array of elements.
      });
    },
  ])
  .directive("keypressEvents", [
    "$document",
    "$rootScope",
    function ($document, $rootScope) {
      return {
        restrict: "A",
        link: function () {
          $document.bind("keydown", function (e) {
            $rootScope.$broadcast("keypress", e);
            $rootScope.$broadcast("keypress:" + e.which, e);
          });
        },
      };
    },
  ])
  .filter("duration", [
    "$filter",
    function ($filter) {
      return function (input) {
        if (input.ufn) {
          return "no end";
        }
        if (input.asap) {
          return "as soon as possible";
        }
        if (input.optimal) {
          return new Date(input.optimal).toLocaleDateString();
        }
        return input;
      };
    },
  ])
  .controller("adController", function ($scope) {
    $scope.showDescription = false;
  })
  .controller("mainController", function ($scope, $http) {
    $scope.sortType = ["publishedAt"]; // set the default sort type
    $scope.sortReverse = true;
    $scope.filters = {
      from: 0,
      to: 13000,
      student: false,
      shared: false,
    };
    $scope.hidden = [];
    if (localStorage.getItem("blocket.hidden")) {
      $scope.hidden = JSON.parse(localStorage.getItem("blocket.hidden"));
    }
    $scope.hide = function (ad) {
      setTimeout(() => {
        $scope.$broadcast("keypress:39");
        removeAd(ad);
      }, 1);
      $scope.hidden.push(ad.id);
      localStorage.setItem("blocket.hidden", JSON.stringify($scope.hidden));
    };
    if (localStorage.getItem("blocket.filters")) {
      $scope.filters = JSON.parse(localStorage.getItem("blocket.filters"));
    }
    $scope.$watch(
      "filters",
      () => {
        localStorage.setItem("blocket.filters", JSON.stringify($scope.filters));
      },
      true
    );

    function removeAd(ad) {
      const index = $scope.ads.indexOf(ad);
      if (index > -1) {
        $scope.ads.splice(index, 1);
      }
    }

    // create the list of sushi rolls
    $scope.ads = [];
    $scope.getAds = function () {
      let paramter = "?";
      for (let filter in $scope.filters) {
        if ($scope.filters[filter]) {
          if (paramter != "?") {
            paramter += "&";
          }
          paramter += filter + "=" + $scope.filters[filter];
        }
      }
      $http.get("/api/ads" + paramter).then(function (response) {
        $scope.ads = response.data;
        for (let ad of [...$scope.ads]) {
          if ($scope.hidden.indexOf(ad.id) > -1) {
            console.log("remove" , ad)
            removeAd(ad);
          }
        }
        $scope.openAd($scope.ads[0]);
      });
    };
    $scope.getAds();

    $scope.openAd = function (ad) {
      $scope.currentAd = ad;
    };
    $scope.$on("keypress:39", function () {
      $scope.$apply(function () {
        const index = $scope.ads.indexOf($scope.currentAd);
        $scope.openAd($scope.ads[index + 1]);
        setTimeout(() => {
          const elem = document.querySelector(".ad.active");
          if (elem) {
            document.getElementById("ads").scrollTop = elem.offsetTop;
          }
        }, 50);
      });
    });
    $scope.$on("keypress:37", function () {
      $scope.$apply(function () {
        const index = $scope.ads.indexOf($scope.currentAd);
        $scope.openAd($scope.ads[index - 1]);
        setTimeout(() => {
          const elem = document.querySelector(".ad.active");
          if (elem) {
            document.getElementById("ads").scrollTop = elem.offsetTop;
          }
        }, 50);
      });
    });
  })
  .directive("ngCarousel", function () {
    return function (scope, element, attrs) {
      var el = element[0];
      var containerEl = el.querySelector("ul");
      var slidesEl = containerEl.querySelectorAll("li");
      scope.numSlides = slidesEl.length;
      scope.curSlide = 0;
      scope.$watch("curSlide", function (num) {
        slidesEl = containerEl.querySelectorAll("li");
        scope.numSlides = slidesEl.length;
        num = num % scope.numSlides;
        scope.curSlide = num;
      });

      el.style.position = "relative";
      el.style.overflow = "hidden";

      containerEl.style.position = "absolute";
      containerEl.style.listStyleType = "none";
      containerEl.style.margin = 0;
      containerEl.style.padding = 0;
      containerEl.style.width = "100%";
    };
  });