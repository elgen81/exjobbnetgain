import assert = require('assert');
import fs = require('fs');
import * as file from '/../dist/file.js'
import { fileExists, appendLine, fileToString, removeLine } from '../../dist/file';

describe('File.ts', function() {

describe('fileexists() checks if file exists if not creates it',function(){
  it('should return 1 and create a file',function(){
    fs.exists('test.ini',function(test){
      assert.equal(test,0)  
      var test = fileExists('test.ini');
      assert.equal(test,1);
      file = fs.existsSync('test.ini');
      assert.equal(test,1);
      fs.unlinkSync('test.ini');  
    });
  });
});

describe('appendline() adds an adress to named file', function(){
  it('When file is not created, should create a file and return 1 if it successfully added line', function(){
    fs.exists('test.ini',function(test){
      assert.equal(test,0);
      appendLine('test', 'www.data.com:8000', function(error,test){
        assert.equal(test,1);
        fs.exists('test.ini',function(test){
          assert.equal(test,1);
          fs.readFile('test.ini',function(err,file){
            assert.equal(file,'#1 www.data.com:8000\n');
            fs.unlinkSync('test.ini');
          }); 
        });      
      });
    });
  });
  it('When file already exists,should return 1 if it successfully added line', function(){
    fs.writeFile('test.ini','',function(err){
      assert.equal(err,0)
      appendLine('test.ini', 'www.data.com:8000', function(error,test){
        assert.equal(test,1);
        assert.equal(error,0);
        fs.exists('test.ini',function(test){
          assert.equal(test,1);
          fs.readFile('test.ini',function(err,file){
            assert.equal(file,'#1 www.data.com:8000\n');
            assert.equal(err,0);
            fs.unlinkSync('test.ini');
          }); 
        });   
      });
    });
  });  
});
  
describe('fileToString() shows the file as a string', function(){
  it('should return the list', function(){
    fs.writeFile('test.ini','#1 www.data.com:8000\n',function(err){
      assert.equal(err, 0)
      fileToString('test.ini', function(fault, data){
        assert.equal(data,'#1 www.data.com:8000\n');
        assert.equal(fault,0);
        fs.unlinkSync('test.ini'); 
      });
    });
  });
  it('should return err if file does not exist',function(){
    fs.exists('test.ini',function(test){
      assert.equal(test,0);
      fileToString('test.ini',function(err,data){
        assert.equal(err,'File does not exist');
        assert.equal(data, ' ');
        fs.unlinkSync('test.ini')
      })
    })
  })
});
describe('removeLine() remove specific line from file',function(){
  it('should return 1 if successful',function(){
    fs.writeFile('test.ini','#1 www.data.com:8000\n', function(err){
      assert.equal(err, 0);
      fs.exists('test.ini',function(test){
        assert.equal(test,1);
        fs.readFile('test.ini',function(err,data){
          assert.equal(data,'#1 www.data.com:8000\n');
          assert.equal(err,0)
          removeLine(test,'www.data.se:8000',function(error, test){
            assert.equal(test,1);
            assert.equal(error,0);
            fs.readFile('test.ini',function(error,data){
              assert.equal(data,'\n');
              assert.equal(error,0);
              fs.unlinkSync('test.ini');
            });
          });
        });
      }); 
    });
  });
  it('should return 0 and "test.ini does not exits" if file does not exist',function(){
      fs.exists('test.ini',function(test){
        assert.equal(test,0);
        removeLine(test,'www.data.se:8000',function(error, test){
          assert.equal(test,0);
          assert.equal(error, "test.ini does not exist");
        });
      }); 
    });
  });
  it('should return 0 and "www.data.se:8000 not in list" if adress is not in file', function(){
    fs.writeFile('test.ini','', function(err){
      assert.equal(err, 0);
      fs.exists('test.ini',function(test){
        assert.equal(test,1);
        fs.readFile('test.ini',function(err,data){
          assert.equal(data,'');
          assert.equal(err,0)
          removeLine(test,'www.data.se:8000',function(error, test){
            assert.equal(test,0);
            assert.equal(error,"www.data.se:8000 not in list");
            fs.unlinkSync('test.ini');
          });
        });
      }); 
    });
  })
});

