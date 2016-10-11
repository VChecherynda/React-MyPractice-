var Search = React.createClass({
  render: function() {

    handleSearch: function(event) {
        var searchQuery = event.target.value.toLowerCase();
        var displayedContacts = notes.filter(function(el) {
            var searchValue = el.name.toLowerCase();
            return searchValue.indexOf(searchQuery) !== -1;
        });
    },

    return (
        <input type="text" className="search" onChange={this.handleSearch}/>
    );

  }

});

var Note = React.createClass({
  render: function(){

      var style = {backgroundColor: this.props.color};

      return (
          <div className="note" style={style}>
           {this.props.children}
           <span className="delete-note" onClick={this.props.onDelete}> x </span>
          </div>
      );
    }
});

var NoteEditor = React.createClass({
  getInitialState: function(){
    return {
      text: '',
      color: ''
    };
  },

  handleTextChange: function(event){
    this.setState({
      text: event.target.value
    });
  },

  handleNodeAdd: function(){
    var newNote = {
        text: this.state.text,
        color: this.state.color,
        id: Date.now()
    };

    this.props.onNoteAdd(newNote);
    this.setState({text: ''});
  },

  handleTextColor: function(event){
    this.setState({
        color: event.target.value
    });
  },

  render: function(){
      return (
         <div className="note-editor">

            <textarea placeholder="Enter your note here..."
                      rows={5}
                      className="textarea"
                      value={this.state.text}
                      onChange={this.handleTextChange}
              />
            <button className="add-button" onClick={this.handleNodeAdd}>Add</button>    
            <input type="color" onChange={this.handleTextColor} />  
         </div> 
      );
  }
});

var NotesGrid = React.createClass({
  componentDidMount: function(){
      var grid = this.refs.grid;
      this.msnry = new Masonry(grid, {
        itemSelector: '.note',
        columnWidth: 200,
        gutter: 10,
        ifFitWidth: true
      });
  },

  componentDidUpdate: function(prevProps){
    if (this.props.notes.length !== prevProps.notes.length) {
        this.msnry.reloadItems();
        this.msnry.layout();
    } 
  },

  render: function(){
      var onNoteDelete = this.props.onNoteDelete;

      return (
         <div className="notes-grid" ref="grid">
           {
            this.props.notes.map(function(note){
              return ( 
                <Note key={note.id}
                      onDelete={onNoteDelete.bind(null, note)}
                      color={note.color}>
                      {note.text}
                </Note>
              );
            })
           }
         </div> 
      );
  }
});

var NotesApp = React.createClass({
  getInitialState: function(){
      return {
        notes: []
      }  
  },

  componentDidMount: function(){
    var localNotes = JSON.parse(localStorage.getItem('notes'));
    if (localNotes) {
        this.setState({ notes: localNotes});
    }
  },

  componentDidUpdate: function(){
      this._updateLocalStorage();
  },

  handleNodeDelete: function(note){
    var noteId = note.id;
    var newNotes = this.state.notes.filter(function(note){
        return note.id !== noteId;
    });
    this.setState({ notes: newNotes });
  },

  handleNodeAdd: function(newNote){
      var newNotes = this.state.notes.slice();
      newNotes.unshift(newNote);
      this.setState({notes: newNotes});
  },

  _updateLocalStorage: function() {
    var notes = JSON.stringify(this.state.notes);
    localStorage.setItem('notes', notes)
  },

  render: function(){
      return (
        <div className="notes-app">
          <h2 className="app-header">NotesApp</h2>
          <Search notes={this.state.notes} />
          <NoteEditor onNoteAdd={this.handleNodeAdd} />
          <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNodeDelete}/>
        </div>  
      );
  }
});

ReactDOM.render(
    <NotesApp />,
    document.getElementById("mount-point")
);

// /* Timer*/
// var Timer = React.createClass({
//             getInitialState: function() {
//                 return {
//                     seconds: 0,
//                     isPaused: 0,
//                 };
//             },

//             componentDidMount: function() {
//                 this.timer = setInterval(this.tick, 1000);
//             },

//             tick: function() {
//                 this.setState({ seconds: this.state.seconds + 1 });
//             },

//             componentWillUnmount: function() {
//                 clearInterval(this.timer);
//             },

//             handleStopStart: function(){

//                 if(this.state.isPaused) {
//                   this.setState({ 
//                     isPaused: 0
//                   }); 
//                   this.componentDidMount();
//                 } else {
//                   this.setState({ 
//                     isPaused: 1
//                   });
//                   clearInterval(this.timer);
//                 }
//             },  

//             handleReverse: function(){
//                 this.setState({ seconds: 0 });
//             },

//             render: function() {
//                 return (
//                   <div>
//                     <div className="stop-start" onClick={this.handleStopStart}></div>
//                     <h4> {this.state.seconds} </h4>
//                     <div className="reverse" onClick={this.handleReverse}></div>
//                   </div>  
//                 );
//             }
//         });

//  ReactDOM.render(
//   <Timer />,
//   document.getElementById("mount-point")
//   )




/* End */

