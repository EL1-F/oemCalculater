// Storage Controller
const StorageController = (function() {
    
    return{
        storeProduct:function(product) {

            let products;

            if (localStorage.getItem('products')===null) {

                products=[];
                products.push(product);

            }else{

                products = JSON.parse(localStorage.getItem('products'));
                products.push(product);
            }

            localStorage.setItem('products',JSON.stringify(products));
        },

        getProducts:function() {
            let products;

            if (localStorage.getItem('products')==null) {

                products=[];

            }else{

                products = JSON.parse(localStorage.getItem('products'));
            }

            return products;
        },

        updateProduct:function(product) {
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach((prd,index)=>{
                if (product.id == prd.id) {
                    products.splice(index,1,product);
                }
            });

            localStorage.setItem('products',JSON.stringify(products));
        },

        deleteProduct:function(product) {
            let products = JSON.parse(localStorage.getItem('products'));

            products.forEach((prd,index)=>{
                if (product.id == prd.id) {
                    products.splice(index,1);
                }
            });

            localStorage.setItem('products',JSON.stringify(products));
        }
    }
})();

//Product Controller
const ProductController = (function() {
    //private
    const Product = function(id,name,price) {
        this.id = id;
        this.name = name;
        this.price= price;
    }

    const data = {
        products:StorageController.getProducts(),
        selectedPrduct:null,
        totalPrice:0
    }

    return{
        //public

        getProduct:function(){
            return data.products;
        },

        getData:function() {
            return data;
        },

        addProduct:function(name,price) {
            let id;
            if (data.products.length>0) {
                id = data.products[data.products.length-1].id+1;
            }else{
                id=0;
            }

            const newProduct = new Product(id,name,parseFloat(price));
            data.products.push(newProduct);

            return newProduct;
            
        },

        getTotal:function() {
            let total = 0;

            data.products.forEach(item=>{
                total+=item.price;
            });

            data.totalPrice = total;

            return data.totalPrice;
        },

        getProductById:function(id) {
            let product = null;
            
            data.products.forEach(function(prd) {
                if (prd.id == id) {
                    product = prd;
                }
            })

            return product;
        },

        setCurrentProduct:function(product) {
            data.selectedPrduct = product;
        },

        getCurrentProduct:function() {
            return data.selectedPrduct;
        },

        editSelected:function(name,price) {
            let product=null;

            data.products.forEach(function(prd){
                if (prd.id == data.selectedPrduct.id) {
                    prd.name = name;
                    prd.price=parseFloat(price);
                    product=prd;
                }

            })
            
            return product;
        },

        deleteProduct:function(product) {
            
            data.products.forEach(function(prd,index){
                if (prd.id == data.selectedPrduct.id) {
                   data.products.splice(index,1);
                }
            })
        }
    }
})();


//UI Controller
const UIController = (function() {

    const Selectors = {
        productList : '#item-list',
        productListItems : '#item-list tr',
        addBtn:'.addBtn',
        productName:'#productName',
        productPrice:'#productPrice',
        productCard:'#productCard',
        totalTl:'#total-tl',
        totalD:'#total-d',
        saveBtn:'.saveBtn',
        deleteBtn:'.deleteBtn',
        cancelBtn:'.cancelBtn',
    };
  
    return{
        creatProductList:function(products) {
            
            var html='';
            for (let product of products) {

                //console.log(product);
                html += `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.price} $</td>
                        <td class="text-right">
                            <button class="btn btn-warning btn-sm" type="submit"><i class="fas fa-edit"></i> Edit</button>
                        </td>
                    </tr>
                `;
            }
            document.querySelector(Selectors.productList).innerHTML = html;
            
        },

        getSelectors:function () {
            return Selectors;
        },

        addProduct:function(product) {

            document.querySelector(Selectors.productCard).style.display = 'block';

            var item =`
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price} $</td>
                    <td class="text-right">
                        <button class="btn btn-warning btn-sm" type="submit"><i class="fas fa-edit"></i> Edit</button>
                    </td>
                </tr>
            `;

            document.querySelector(Selectors.productList).innerHTML+=item;
        },

        clearInputs:function() {
            document.querySelector(Selectors.productName).value='';
            document.querySelector(Selectors.productPrice).value='';
        },

        clearWarning:function() {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(item=>{
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning')
                }
            });
        },

        hideCard:function() {
            document.querySelector(Selectors.productCard).style.visibility = "block";
        },

        showTotal:function(total) {
            document.querySelector(Selectors.totalD).textContent = total;
            document.querySelector(Selectors.totalTl).textContent = total*20;
        },

        addProductToForm:function() {

            const selectedProduct = ProductController.getCurrentProduct();

            document.querySelector(Selectors.productName).value=selectedProduct.name;
            document.querySelector(Selectors.productPrice).value=selectedProduct.price;

        },

        addingState:function(item) {

            UIController.clearWarning();
            UIController.clearInputs();

            document.querySelector(Selectors.addBtn).style.display= 'inline';
            document.querySelector(Selectors.deleteBtn).style.display = "none";
            document.querySelector(Selectors.cancelBtn).style.display = "none";    
            document.querySelector(Selectors.saveBtn).style.display = "none"; 
        },

        editState:function(tr) {

            tr.classList.add('bg-warning');

            document.querySelector(Selectors.addBtn).style.display= 'none';
            document.querySelector(Selectors.deleteBtn).style.display = "inline";
            document.querySelector(Selectors.cancelBtn).style.display = "inline";    
            document.querySelector(Selectors.saveBtn).style.display = "inline"; 
        },

        showEditProduct:function(product) {
            let updatedItem = null;
            let child= document.querySelector(Selectors.productList).children;

            for (let item of child) {
                if (item.classList.contains('bg-warning')) {

                    item.children[1].textContent = product.name;
                    item.children[2].textContent = product.price+' $';

                    updatedItem = item;
                }
            }
            return updatedItem;
        },

        deleteProduct:function() {
            let items= document.querySelectorAll(Selectors.productListItems);

            for (let item of items) {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            }

        }
    }
})();

//App Controller >> ana modül 
const AppController = (function(ProductCtrl,UICtrl, StorageCtrl) {

    const UISelectors = UICtrl.getSelectors();

    //Load Event Listeners

    const loadEventListeners = function() {
        //add product event
        document.querySelector(UISelectors.addBtn).addEventListener('click',productAddSubmit);

        //edit product click
        document.querySelector(UISelectors.productList).addEventListener('click',productEditClick);

        //edit product
        document.querySelector(UISelectors.saveBtn).addEventListener('click',productEdit);

        //cancel btn click
        document.querySelector(UISelectors.cancelBtn).addEventListener('click',cancelUpdate);

        //delete btn click
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteProductSubmit);
    }

    const deleteProductSubmit=function(e) {

        //get selected product
        const selectedProduct = ProductCtrl.getCurrentProduct();

        //delete product
        ProductCtrl.deleteProduct(selectedProduct);

        //delete ui
        UICtrl.deleteProduct();

        UIController.addingState();

        //get total
       const total = ProductCtrl.getTotal();

       //show total
        UICtrl.showTotal(total);

        //delete product in storage
        StorageCtrl.deleteProduct(selectedProduct);

        if (total ==0) {
            UICtrl.hideCard();
        }



        e.preventDefault();
    }

    const cancelUpdate=function(e) {

        UICtrl.addingState();

        UICtrl.clearWarning();

        e.preventDefault();
    }

    const productEdit = function(e) {
        
        
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !=='' && productPrice!==''){

            //edit selected product
            const edit = ProductCtrl.editSelected(productName,productPrice);
            console.log(edit);

            //edit product show
            UIController.showEditProduct(edit);

            UIController.addingState();

            
            //get total
            const total = ProductCtrl.getTotal();
            
            //show total
            UICtrl.showTotal(total);
            
            //update storage
            StorageCtrl.updateProduct(edit);

            //clear inputs
            UICtrl.clearInputs();

            
        }

        e.preventDefault();
    }

    const productEditClick=function(e) {
        
        if (e.target.classList.contains('btn-warning')) {
          
            const editid = e.target.parentElement.parentElement.firstElementChild.textContent;
                        
            //get selected product
            const product = ProductCtrl.getProductById(editid);
            
            //set current product
            ProductCtrl.setCurrentProduct(product);

            UICtrl.clearWarning();

            //add product to ui
            UICtrl.addProductToForm();

            UICtrl.editState(e.target.parentElement.parentElement);

        }

        e.preventDefault();
    }

    const productAddSubmit = function(e) {
        
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        
        if (productName !=='' && productPrice!=='') {
            //add product
           const newProduct= ProductCtrl.addProduct(productName,productPrice); 

           //add item to list 
           UICtrl.addProduct(newProduct);

           //add product to ls
           StorageCtrl.storeProduct(newProduct);

           //get total
           const total = ProductCtrl.getTotal();

           //show total
            UICtrl.showTotal(total);

            //clear inputs
           UICtrl.clearInputs();

        }
        e.preventDefault();
    }

    return{
        init:function() {
            console.log('starting app...');
            UICtrl.addingState();
            const products = ProductCtrl.getProduct();

            if (products.length == 0) {
                UICtrl.hideCard();
            }else{

                UICtrl.creatProductList(products);
                //get total
                const total = ProductCtrl.getTotal();
                
                //show total
                UICtrl.showTotal(total);
            }
        

            //load event listener
            loadEventListeners();
        }
    }
    
})(ProductController,UIController,StorageController);


AppController.init();
