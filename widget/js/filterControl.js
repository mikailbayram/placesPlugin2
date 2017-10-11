
let filterControl = {
    openFilter: () => {
        let sideNav = document.getElementById("mySidenav");
        let categoriesDiv = sideNav.querySelector('#categories');

        categoriesDiv.innerHTML = '';

        if(app.state.categories){
            app.state.categories.forEach(category => {
                let link = categoriesDiv.appendChild(document.createElement('a'));
                link.innerHTML = category.name;
                link.setAttribute('href', 'javascript:void(0)');
                link.setAttribute('id', category.name);
                link.setAttribute('onclick', `filterControl.filterCategory('${category.name}')`);
            });
        }

        sideNav.style.height = "100%";
    },
    filterCategory: (categoryName) => {
        let categoryIndex = app.state.categories.findIndex(category => {return category.name === categoryName});
        //Switch the category's state
        app.state.categories[categoryIndex].isActive = (!app.state.categories[categoryIndex].isActive);

        let categoryDiv = document.getElementById(categoryName);
        let backgroundColor = (app.state.categories[categoryIndex].isActive) ? 'black' : 'red';
        categoryDiv.setAttribute('style', `background-color:${backgroundColor};`);

        let activeCategories = app.state.categories.filter((x, index) => {return index != categoryIndex}).map(c => c.name);

        //TODO: Make copy of unfiltered places
        app.state.places = app.state.places.filter(place => {
            //If a location has no categories, we always show it
            if(typeof place.categories === 'undefined' || place.categories.length === 0){
                console.error('No category');
                return true;
            }

            //Does the place include any of the

            let isMatch = place.categories.some(placeCategory => {
                return activeCategories.includes(placeCategory);
            });

            return isMatch;
        });

        //TODO: Update UI to reflect selected categories
    },
    closeNav: () => document.getElementById("mySidenav").style.height = "0",
    changeView: () => {
        app.state.mode = (app.state.mode == app.settings.viewStates.list) ? app.settings.viewStates.map : app.settings.viewStates.list;

        router.navigate(`/${app.state.mode}`);
    },
    createControl: (controlDiv, buttons) => {
        let container = document.createElement('div');
        container.className = 'buttonContainer';

        controlDiv.appendChild(container);

        buttons.forEach((button) =>{
            let controlButton = document.createElement('div');
            let imageName = (button.name) ? button.name : app.state.mode;
            if(imageName === 'changeView'){
                imageName = (app.state.mode === app.settings.viewStates.list) ? app.settings.viewStates.map : app.settings.viewStates.list;
            }

            controlButton.style.display = 'inline-block';
            controlButton.style.padding = button.padding;
            controlButton.innerHTML = `<img src="./images/${imageName}.svg"></img>`;
            if(button.action)
                controlButton.onclick = button.action;
            container.appendChild(controlButton);
        });

        return container;
    }
};

function CenterControl(controlDiv) {
    filterControl.createControl(controlDiv, [
        {name:'center', action: mapView.centerMap, padding: '8px'}
    ]);
}

function FilterControl (controlDiv){
    filterControl.createControl(controlDiv, [
        {name:'changeView', action: filterControl.changeView, padding: '12px'},
        {name:'filter', action: filterControl.openFilter, padding: '12px'}
    ]);
}