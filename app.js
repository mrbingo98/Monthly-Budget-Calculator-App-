// Budget Controller Module
var budgetController = (function(){
    // Expense Function Constructor
    var Expense = function(id,des,value){
        this.id = id
        this.des = des
        this.value = value
    }
    Expense.prototype.calcPercentage = function(){
        if(data.tottals.inc > 0){
            this.percentage = Math.round((this.value*100)/data.tottals.inc)
        }else{
            this.percentage = 0;
        }
        
    }
    // Income Function Constructor
    var Income = function(id,des,value){
        this.id = id
        this.des = des
        this.value = value
    }
    // All Budget Data Object
    var data = {
        allItems : {
            exp:[],
            inc:[]
        },
        tottals:{
            exp:0,
            inc:0,
            bud:0
        },
        calcTottals: function(type){
            this.tottals[type]=0
                this.allItems[type].forEach(el => {
                    this.tottals[type] += el.value
                });
            this.tottals.bud = this.tottals.inc - this.tottals.exp;
            
        },
        calcExpensesPercentage: function(){
            var percentage;
            if(this.tottals.inc > 0){
                percentage = Math.round((this.tottals.exp*100)/this.tottals.inc)
                this.tottals.expensesPercentage = percentage;
            }else{
                this.tottals.expensesPercentage = 0;
            }
            
        }
    }
    // Module returners
    return{
        // Add Items to data Object Function
        addItemBudget : function(type,des,value){
            var newItem,id;
            // if there are items in the array of entered type ('exp' || 'inc') the id of the new item will be the last item id + 1
            if(data.allItems[type].length > 0){
                id = data.allItems[type][data.allItems[type].length-1].id + 1;
            }else
            // if there are no items in the array of entered type ('exp' || 'inc') the id of the new item will be 0
            {
                id = 0
            }
            // if the entered type ('inc') the newItem will be an instance of the Income Constructor
            if(type==='inc')
            {
                newItem = new Income(id,des,value)
            }else
            // if the entered type ('exp') the newItem will be an instance of the Expense Constructor
            {
                newItem = new Expense(id,des,value)
                newItem.calcPercentage(data.tottals.inc)
            }
            // push the newItem into the type ('exp' || 'inc') array then return the newItem object
            data.allItems[type].push(newItem)
            data.calcTottals(type)
            return newItem
        },
        tottals:function(){
            data.calcTottals('exp')
            data.calcTottals('inc')
            data.calcExpensesPercentage()
            return {
                income: data.tottals.inc,
                expense: data.tottals.exp,
                budget: data.tottals.bud,
                tottalExpensesPercentage: data.tottals.expensesPercentage
            }
        },
        expenses: function(){
            return{
                allExp: data.allItems.exp
            }
        },
        deleteItem: function(id,type){
            var ids,index;
            ids = data.allItems[type].map((cur)=>{
                return cur.id;
            })
            index = ids.indexOf(id)
            if(index !== -1){
                data.allItems[type].splice(index, 1)
                // data.allItems[type][index].delete()
            }
            
        },
        updatePercentages: function(){
            var allperc = data.allItems.exp.map((el)=>{
                el.calcPercentage()
                return el.percentage
            })
            return allperc
        }
            
    }
    
} )();
// User Interface Controller Module
var UIController = (function(){
    // object to store the classes and id's of the document
    var DOMStrings = {
        itemType: document.querySelector('.add__type'),
        itemDescription: document.querySelector('.add__description'),
        itemValue: document.querySelector('.add__value'),
        addItemBtn: document.querySelector('.add__btn'),
        incListContainer: document.querySelector('.income__list'),
        expListContainer: document.querySelector('.expenses__list'),
        tottalIncomes: document.querySelector('.budget__income--value'),
        tottalExpenses: document.querySelector('.budget__expenses--value'),
        tottalExpensesPercentage: document.querySelector('.budget__expenses--percentage'),
        budgetValue: document.querySelector('.budget__value'),
        newItemPercentage: document.querySelector('.item__percentage'),
        allItemsContainer: document.querySelector('.container'),
        date: document.querySelector('.budget__title--month')
    },
    nodeListIterator = function(nodeList, callBack){
        for(i = 0; i < nodeList.length; i++){
            callBack(nodeList[i],i)
        }
    };

    return {
        DOM:DOMStrings,
        // methode that return the entered data
        getInputData : function(){
            return{
                Type:DOMStrings.itemType.value,
                Description:DOMStrings.itemDescription.value,
                Value:parseFloat(DOMStrings.itemValue.value)
            }
        },
        addItemUI : function(newItem,type){
            var newItem,container;
            if(type==='inc'){
                container = DOMStrings.incListContainer;
                newItem = '<div class="item clearfix" id="inc-'+newItem.id+'"><div class="item__description">'+newItem.des+'</div><div class="right clearfix"><div class="item__value">+'+newItem.value+'</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type==='exp'){
                container = DOMStrings.expListContainer;
                newItem = '<div class="item clearfix" id="exp-'+newItem.id+'"><div class="item__description">'+newItem.des+'</div><div class="right clearfix"><div class="item__value">-'+newItem.value+'</div><div class="item__percentage">'+newItem.percentage+'%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            container.insertAdjacentHTML('beforeend',newItem)
        },
        addTottalsUI: function(tottals){
            var budOperator;
            if(tottals.income > tottals.expense){
                budOperator='+'
            }else{
                budOperator=''
            }
            if(tottals.tottalExpensesPercentage > 0){
                DOMStrings.tottalExpensesPercentage.textContent = tottals.tottalExpensesPercentage + '%'
            }else{
                DOMStrings.tottalExpensesPercentage.textContent = '--'
            }
            DOMStrings.tottalIncomes.textContent = '+' + tottals.income
            DOMStrings.tottalExpenses.textContent = '-' + tottals.expense
            DOMStrings.budgetValue.textContent = budOperator + tottals.budget
        },
        updatePercentagesUI: function(percentages){
            var allPerc = document.querySelectorAll('.item__percentage');
            nodeListIterator(allPerc, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%'
                }else{
                    current.textContent = '---'
                }
                
            })
        },
        clearFields: function(){
            DOMStrings.itemDescription.value = ''
            DOMStrings.itemValue.value = ''
            DOMStrings.itemDescription.focus()
        },
        deleteItemUI: function(elementID){
            var element = document.getElementById(elementID);
            element.parentNode.removeChild(element);

        },
        changedType:function(){
            DOMStrings.itemType.classList.toggle('red-focus')
            DOMStrings.itemDescription.classList.toggle('red-focus')
            DOMStrings.itemValue.classList.toggle('red-focus')
            DOMStrings.addItemBtn.classList.toggle('red')
        },
        displayDate: function(){
            var now = new Date(),
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            year = now.getFullYear(),
            month = months[now.getMonth() - 1];
            DOMStrings.date.textContent = ' ' + month + ', ' + year
        }
    }
})();
// App Controller (Events Handellers) Module
var appController = (function(UICTRL,BudCTRL){
    // a function that contains all the event listeners of the app
    function setupEventsListener(){
        // event listeners to handell the add button click
        UICTRL.DOM.addItemBtn.addEventListener('click',addItem)
        // event listeners to handell the enter button press
        document.addEventListener('keypress',(event)=>{
        if(event.keyCode===13 || event.which===13){
            addItem();
        }
        })
        UICTRL.DOM.allItemsContainer.addEventListener('click',deleteItem)
        UICTRL.DOM.itemType.addEventListener('change',UICTRL.changedType)
    }

    function addItem(){
        // get input data
       var Data = UICTRL.getInputData()
       if(Data.Description !== '' && !isNaN(Data.Value) && Data.Value > 0){
           // add item to budget controller and retrive the new item object
            var newItem = BudCTRL.addItemBudget(Data.Type,Data.Description,Data.Value)
            //add item to ui
            UICTRL.addItemUI(newItem ,Data.Type)
            // clear inputs fields
            UICTRL.clearFields()
            // add budget value, tottal income and tottal expenses to UI
            // Update Percentage
            updatePercandtottals();
        }
       
    }
    function deleteItem (e){
        var elementID,splitID,type,id;
        elementID = e.target.parentNode.parentNode.parentNode.parentNode.id
        if(elementID){
            splitID = elementID.split('-');
            type = splitID[0]
            id = parseInt(splitID[1])
            BudCTRL.deleteItem(id,type)
            UICTRL.deleteItemUI(elementID)
            updatePercandtottals();
        }
    }
    function updatePercandtottals(){
        UICTRL.addTottalsUI(BudCTRL.tottals())
        UICTRL.updatePercentagesUI(BudCTRL.updatePercentages())

    }
    return{
        init:function(){
            setupEventsListener();
            UICTRL.displayDate()
        }
    }
})(UIController,budgetController);

appController.init()