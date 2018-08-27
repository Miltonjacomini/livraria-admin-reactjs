import React, { Component } from 'react';
import $ from 'jquery';
import InputCustom from './components/InputCustom';
import PubSub from 'pubsub-js';
import ErrorTreatment from './utils/ErrorTreatment';

export default class LivroBox extends Component {

    constructor () {
        super();
        this.state = { livros : [], autores: [] };
    }

    componentDidMount() {
        $.ajax({
            url: 'http://localhost:8080/api/autores',
            dataType: 'json',
            success: function(response) {
                this.setState({ autores: response });
            }.bind(this)
        });
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content mg-top-10">
                    <LivroForm autores={this.state.autores} />
                    <LivroTable />
                </div>
            </div>
        );
    }
}

class LivroForm extends Component {

    constructor() {
        super();
        this.state = { titulo: '', preco: 0.0, autorId: '', autores: [] };
        this.sendForm = this.sendForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
        this.cleanFields = this.cleanFields.bind(this);
    }

    setTitulo(evt) {
        this.setState({ titulo: evt.target.value });
    }

    setPreco(evt) {
        this.setState({ preco: evt.target.value });
    }

    setAutorId(evt) {
        this.setState({ autorId: evt.target.value });
    }

    cleanFields() {
        this.setState({ 
                id : '', 
                titulo: '', 
                preco: 0.0, 
                autorId: ''
        });
    }

    sendForm(event) {
        event.preventDefault();
    
        var titulo = this.state.titulo.trim();
        var preco = this.state.preco.trim();
        var autorId = this.state.autorId;

        $.ajax({
          url:'http://localhost:8080/api/livros',
          type: 'POST',
          contentType: 'application/json',
          dataType: 'JSON',
          data: JSON.stringify(
            {
                titulo: titulo, 
                preco: preco, 
                autorId: autorId
            }
          ),
          success: function(response) { 
            PubSub.publish('update-list-livros', response);
            this.cleanFields();
          }.bind(this), 
          error: function(err) {
            if (err.status === 400) {
                new ErrorTreatment().publish(err.responseJSON);
            }
          },
          beforeSend: function(){
            PubSub.publish('clean-errors-form-livros', {});
          }      
        });
    }

    render() {

        var autores = this.props.autores.map(function(autor){
            return <option key={autor.id} value={autor.id}>{autor.nome}</option>;
        });

        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" method="POST" onSubmit={this.sendForm}>
                
                    <InputCustom id="titulo" label="Titulo" name="titulo" type="text" 
                        value={this.state.titulo} onChange={this.setTitulo} />

                    <InputCustom id="preco" label="Preço" name="preco" type="text" 
                        value={this.state.preco} onChange={this.setPreco} />

                    <div className="pure-control-group">
                        <label htmlFor="autor">Autor</label>
                        <select id="autor" label="Autor" name="autorId" 
                            value={this.state.autorId} onChange={this.setAutorId}>
                            <option>Selecione o autor</option> 
                            { autores }
                        </select>
                    </div>

                    <div className="pure-control-group">                                  
                        <label></label> 
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
                    </div>
                </form>             
            </div> 
        );
    }
}

class LivroTable extends Component {

    constructor() {
        super();
        this.state = { livros: [] };
    }

    componentDidMount() {
        $.ajax({
            url: 'http://localhost:8080/api/livros',
            dataType: 'json',
            success: function(response) {
                this.setState({ livros: response });
            }.bind(this)
        });

        PubSub.subscribe('update-list-livros', function(topic, newList) {
            this.setState({ livros: newList });
        }.bind(this));
    }

    render () {

        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Preço</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.livros.map(function(livro) {
                                return (
                                <tr key={livro.id}>
                                    <td>{livro.titulo}</td>
                                    <td>{livro.preco}</td>
                                    <td>{livro.autor.nome}</td>
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