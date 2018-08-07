import React, {Component} from 'react';
import $ from 'jquery';
import InputCustom from './components/InputCustom';

class AutorForm extends Component {
    
    constructor() {
        super();
        this.state = {nome: '', email: '', senha: ''};
        this.sendForm = this.sendForm.bind(this);
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
        this.cleanFields = this.cleanFields.bind(this);
    }

    sendForm(event) {
        event.preventDefault();
    
        $.ajax({
          url:'http://localhost:8080/api/autores',
          type: 'POST',
          contentType: 'application/json',
          dataType: 'JSON',
          data: JSON.stringify(
            {
              nome: this.state.nome, 
              email: this.state.email, 
              senha: this.state.senha
            }
          ),
          success: function(response) {
            this.props.callbackUpdate(response);
            this.cleanFields();
          }.bind(this), 
          error: function(err) {
            console.log(err);
          }
        });
    
    }

    setNome(evt) {
        this.setState({nome: evt.target.value});
    }

    setEmail(evt) {
        this.setState({email: evt.target.value});
    }

    setSenha(evt) {
        this.setState({senha: evt.target.value});
    }

    cleanFields() {
        this.setState({nome: '', email: '', senha: ''});
    }
      
    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" method="POST" onSubmit={this.sendForm}>
                
                    <InputCustom id={this.state.nome} label="Nome" name="nome" type="text" 
                        value={this.props.nome} onChange={this.setNome} />

                    <InputCustom id={this.state.email} label="E-mail" name="email" type="email" 
                        value={this.props.email} onChange={this.setEmail} />

                    <InputCustom id={this.state.senha} label="Senha" name="senha" type="password" 
                        value={this.props.senha} onChange={this.setSenha} />

                    <div className="pure-control-group">                                  
                        <label></label> 
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                    </div>
                </form>             
            </div> 
        );
    }
}

class AutorTable extends Component {
    
    constructor() {
        super();
        this.state = {autores: []};
    }
 
    render() {
        return (
            <div>            
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.autores.map(function(autor) {
                                return (
                                <tr key={autor.id}>
                                    <td>{autor.nome}</td>                
                                    <td>{autor.email}</td>                
                                </tr>
                                );
                            })
                        }
                    </tbody>
                </table> 
            </div>  
        );
    }
}

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = {autores: []};
        this.updateList = this.updateList.bind(this);
    }

    componentDidMount() {
        $.ajax({
            url: 'http://localhost:8080/api/autores',
            dataType: 'json',
            success: function(response) {
                this.setState({autores: response});
            }.bind(this)
        });
    }

    updateList(newList) {
        this.setState({autores: newList});
    }

    render() {
        return (
            <div>
                <AutorForm callbackUpdate={this.updateList} />
                <AutorTable autores={this.state.autores} />
            </div>
        );
    }
}