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
    function () {
      return function (input) {
        if (input.ufn) {
          return "'until further'";
        }
        if (input.asap) {
          return "'immediate'";
        }
        if (input.optimal) {
          return new Date(input.optimal).toLocaleDateString();
        }
        return input;
      };
    },
  ])
  .controller("homeController", function ($scope) {
    $scope.showDescription = false;
  })
  .controller("mainController", function ($scope, $http) {
    $scope.loading = true;
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
    $scope.hide = function (home) {
      setTimeout(() => {
        $scope.$broadcast("keypress:39");
        removeHome(home);
      }, 1);
      $scope.hidden.push(home.id);
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

    function removeHome(home) {
      const index = $scope.homes.indexOf(home);
      if (index > -1) {
        $scope.homes.splice(index, 1);
      }
    }

    // create the list of sushi rolls
    $scope.homes = [];
    $scope.getHomes = function () {
      $scope.loading = true;
      let paramter = "?";
      for (let filter in $scope.filters) {
        if ($scope.filters[filter]) {
          if (paramter != "?") {
            paramter += "&";
          }
          paramter += filter + "=" + $scope.filters[filter];
        }
      }
      $http.get("/api/homes" + paramter).then(function (response) {
        $scope.homes = response.data;
        for (let home of [...$scope.homes]) {
          if ($scope.hidden.indexOf(home.id) > -1) {
            removeHome(home);
          }
        }
        $scope.openHome($scope.homes[0]);
        $scope.loading = false;
      });
    };
    $scope.getHomes();

    $scope.openHome = function (home) {
      $scope.currentHome = home;
    };
    function scroll() {
      setTimeout(() => {
        const elem = document.querySelector(".home.active");
        if (elem) {
          const homesE = document.getElementById("homes");
          homesE.scrollTop = elem.offsetTop - homesE.clientHeight/2 + elem.clientHeight/2;
        }
      }, 10);
    }
    $scope.$on("keypress:39", function () {
      $scope.$apply(function () {
        let index = $scope.homes.indexOf($scope.currentHome) + 1;
        if (index < 0) {
          index = 0
        }
        if (index >= $scope.homes.length) {
          index = $scope.homes.length - 1
        } 
        $scope.openHome($scope.homes[index]);
        scroll();
      });
    });
    $scope.$on("keypress:37", function () {
      $scope.$apply(function () {
        let index = $scope.homes.indexOf($scope.currentHome) - 1;
        if (index < 0) {
          index = 0
        }
        if (index >= $scope.homes.length) {
          index = $scope.homes.length - 1
        } 
        $scope.openHome($scope.homes[index]);
        scroll();
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
