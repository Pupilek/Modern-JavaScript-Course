const list = document.querySelector('ul');
const form = document.querySelector('form');
const button = document.querySelector('button');

const addRecipe = (recipe, id) => {
  let time = recipe.created_at.toDate();
  let html = `
    <li data-id = "${id}">
      <div>${recipe.title}</div>
      <div>${time}</div>
      <button class = "btn btn-danger btn sm my-2">delete</button>
    </li>
  `;
  //console.log(html);
  list.innerHTML += html;
}

const deleteRecipe = (id) => {
  const recipes = document.querySelectorAll('li');
  recipes.forEach(recipe => {
    if(recipe.getAttribute('data-id')===id){
      recipe.remove();
    }
  });
}

//get documents (withour real time listeners)
// db.collection('recipes').get().then(snapshot => {
//   //when we have a data
//   //console.log(snapshot.docs[0].data());
//   snapshot.docs.forEach(doc => {
//     addRecipe(doc.data(), doc.id);
//     //console.log(doc.data());
//   }); 
// }).catch(err =>{
//   console.log(err);
// });

//get documents with real time listeners
const unsub = db.collection('recipes').onSnapshot(snapshot => {
  //console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
    //console.log(doc);
    if(change.type === 'added'){
      addRecipe(doc.data(), doc.id)
    } else if (change.type === 'removed'){
      deleteRecipe(doc.id);
    }
  })
})

//add documents
form.addEventListener('submit', e =>{
  e.preventDefault();

  const now = new Date();
  const recipe = {
    title: form.recipe.value,
    created_at: firebase.firestore.Timestamp.fromDate(now)
  };
  db.collection('recipes').add(recipe).then (() => {
    console.log('recipe added');
  }).catch(err => {
    console.log(err);
  });
});


//deleting data
list.addEventListener('click', e =>{
  //console.log(e);
  if(e.target.tagName === "BUTTON"){
    const id = e.target.parentElement.getAttribute("data-id");
    //console.log(id);
    db
    .collection('recipes').doc(id).delete()
    .then(() => {
      console.log('recipe deleted');})
    .catch(err => {
      console.log(err);
    });
  }
})

//unsub from database changes

button.addEventListener('click', () => {
  unsub();
  console.log('unsubscribed from collection changes')
})
