var package_path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
var dojoConfig = {
    //window.location.path enable to acces the file from the correct path
    packages: [{
            name: "application",
            location: package_path + 'js/lib'
        },
        {
            name: "appWidgets",
            location: package_path + 'js/widgets'
        }]
};