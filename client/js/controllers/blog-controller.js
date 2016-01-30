app.controller('blogController', ['$scope', '$resource', 'utilityService', function ($scope, $resource, utilityService) {
  var Blog = $resource('/api/blog');

  Blog.query(function (results) {
    $scope.blogList = results;

    //format post date time string
    angular.forEach($scope.blogList,function(value,index){
        var getPostDate = new Date($scope.blogList[index].post_date);
        //format post date by utilityService
        $scope.blogList[index].post_date = utilityService.getFormattedDate(getPostDate);
    })
  });

  $scope.blogList = []

  $scope.createBlog = function () {
    var blog = new Blog();
    blog.post_title = $scope.blogTitle;
    blog.post_content = $scope.blogContent;
    blog.$save(function (result) {
      $scope.blogList.push(result);
      $scope.blogTitle = '';
      $scope.blogContent = '';
    });
  }
}]);
