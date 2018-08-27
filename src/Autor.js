import React, {Component} from 'react';
import $ from 'jquery';
import InputCustom from './components/InputCustom';
import PubSub from 'pubsub-js';
import ErrorTreatment from './utils/ErrorTreatment';

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = { autores: [] };
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content mg-top-10">
                    <AutorForm />
                    <AutorTable />
                </div>
            </div>
        );
    }
}

class AutorForm extends Component {
    
    constructor() {
        super();
        this.state = {nome: '', email: '', senha: ''};
        this.sendForm = this.sendForm.bind(this);
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
            PubSub.publish('update-list-autores', response);
            this.cleanFields();
          }.bind(this), 
          error: function(err) {
            if (err.status === 400) {
                new ErrorTreatment().publish(err.responseJSON);
            }
          },
          beforeSend: function(){
            PubSub.publish('clean-errors-form-autores', {});
          }      
        });
    }

    setFieldValue(inputName, event) {
        var fieldChanged = {};
        fieldChanged[inputName] = event.target.value;
        this.setState(fieldChanged)
    }

    cleanFields() {
        this.setState({ nome: '', email: '', senha: '' });
    }
      
    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" method="POST" onSubmit={this.sendForm}>
                
                    <InputCustom id={this.state.nome} label="Nome" name="nome" type="text" 
                        value={this.state.nome} onChange={this.setFieldValue.bind(this, 'nome')} />

                    <InputCustom id={this.state.email} label="E-mail" name="email" type="email" 
                        value={this.state.email} onChange={this.setFieldValue.bind(this, 'email')} />

                    <InputCustom id={this.state.senha} label="Senha" name="senha" type="password" 
                        value={this.state.senha} onChange={this.setFieldValue.bind(this, 'senha')} />

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

    componentDidMount() {
        $.ajax({
            url: 'http://localhost:8080/api/autores',
            dataType: 'json',
            success: function(response) {
                this.setState({autores: response});
            }.bind(this)
        });

        PubSub.subscribe('update-list-autores', function(topic, newList) {
            this.setState({autores: newList});
        }.bind(this));
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
                            this.state.autores.map(function(autor) {
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