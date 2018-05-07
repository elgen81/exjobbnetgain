import assert = require('assert');
import fs = require('fs');
import * as file from './../file'
import { fileExists, appendLine, fileToString, removeLine } from './../file';

interface ICallback{
  (error:Error, status:boolean) :void
}

function removeini(callback?:ICallback){
  fs.open('test.ini','r',function(err,data){
    if(err){
      callback(err,true)
    }
    else{
      fs.unlinkSync('test.ini');
      callback(null,true)
    }
  })
}

describe('File.ts', function() {

  describe('fileexists() checks if file exists if not creates it',function(){
    it('should return 1 and create a file if none exists',function(){
      removeini(function(err,test){
        assert.equal(test,true)
        fs.open('test.ini','r', function(err,test){
          assert.equal(test,null)
          fileExists('test.ini',function(err,test){
            assert.equal(test,1);
            assert.equal(err,null)
            fs.open('test.ini','r',function(err,test){
              assert.equal(err,null)
              removeini(function(err,test){         
                assert.equal(test,true)
              }); 
            });
          });
        });
      });
    });

    it('should return 1 if the file exists',function(){
      removeini(function(err,test){         
        assert.equal(test,true)
        fs.open('test.ini','a+',function(err,file){
          assert.equal(err,null)
          fs.open('test.ini','r', function(err,test){
            assert.equal(err,null)
            fileExists('test.ini',function(err,test){
              assert.equal(test,1);
              assert.equal(err,null)
              fs.open('test.ini','r',function(err,test){
                assert.equal(err,null);
                removeini(function(err,test){         
                  assert.equal(test,true)
                });
              });
            });
          });
        });
      });
    });
  });

  describe('appendline() adds an adress to named file', function(){
    it('When file is not created, should create a file and return 1 if it successfully added line', function(){
      removeini(function(err,test){         
        assert.equal(test,true)
        fs.open('test.ini','r',function(err,test){
          assert.equal(err,'Error: ENOENT: no such file or directory, open \'test.ini\'');
          appendLine('test.ini', 'www.data.com:8000', function(error,test){
            assert.equal(test,true);
            assert.equal(error,null);
            fs.open('test.ini','r',function(err){
              assert.equal(err,null);
              fs.readFile('test.ini','utf8',function(err,file){
                assert.equal(file,'#1 www.data.com:8000\n');
                removeini(function(err,test){         
                  assert.equal(test,true)
                });
              }); 
            });      
          });
        });
      });
    });

    it('When file already exists,should return 1 if it successfully added line', function(){
      removeini(function(err,test){         
        assert.equal(test,true)
        fs.writeFile('test.ini','','utf8',function(err){
          assert.equal(err,null)
          fs.open('test.ini','r',function(err, data){
            assert.equal(err,null)
            appendLine('test.ini', 'www.data.com:8000', function(error,test){
              assert.equal(test,false);
              assert.equal(error,null);
              fs.open('test.ini','r',function(test){
                assert.equal(err,null);
                fs.readFile('test.ini','utf8',function(err,file){
                  assert.equal(file,'#1 www.data.com:8000\n');
                  assert.equal(err,null);
                  removeini(function(err,test){         
                    assert.equal(test,true)
                  });
                });  
              }); 
            });   
          });
        });
      });
    });  
  });
    
  describe('fileToString() shows the file as a string', function(){
    it('should return the list', function(){
      removeini(function(err,test){         
        assert.equal(test,true)
        fs.writeFile('test.ini','#1 www.data.com:8000\n','utf8',function(err){
          assert.equal(err, null)
          fileToString('test.ini', function(err, data){
            assert.equal(data,'#1 www.data.com:8000\n');
            assert.equal(err,null); 
            removeini(function(err,test){         
              assert.equal(test,true)
            });
          });
        });
      });
    });

    it('should return err if file does not exist',function(){
      removeini(function(err,test){         
        assert.equal(test,true)
        fs.open('test.ini','r',function(err){
          assert.equal(err,'Error: ENOENT: no such file or directory, open \'test.ini\'');
          fileToString('test.ini',function(err,data){
            assert.equal(err,'Error: File does not exist');
            assert.equal(data, ' ');
            removeini(function(err,test){         
              assert.equal(test,true)
            });
          });
        });
      });
    });
  });

  describe('removeLine() remove specific line from file',function(){
    it('should return 1 if successful',function(){
      removeini(function(err,test){         
        assert.equal(test,true)
        fs.writeFile('test.ini','#1 www.data.com:8000\n','utf8', function(err){
          assert.equal(err, null);
          fs.open('test.ini','r',function(err,test){
            assert.equal(err,null);
            fs.readFile('test.ini',function(err,data){
              assert.equal(data,'#1 www.data.com:8000\n');
              assert.equal(err,null)
              removeLine("test.ini",'www.data.se:8000',function(error, test){
                assert.equal(test,1);
                assert.equal(error,0);
                fs.readFile('test.ini',function(error,data){
                  assert.equal(data,'\n');
                  assert.equal(error,0);
                  removeini(function(err,test){         
                    assert.equal(test,true)
                  });
                });
              });
            });
          }); 
        });
      });
    });

    it('should return 0 and "test.ini does not exits" if file does not exist',function(){
      removeini(function(err,test){         
        assert.equal(test,true)
        fs.open('test.ini','r',function(err, test){
          assert.equal(test,null);
          removeLine("test.ini",'www.data.se:8000',function(error, test){
            assert.equal(test,false);
            assert.equal(error, "test.ini does not exist");
            removeini(function(err,test){         
              assert.equal(test,true)
            });
          });
        }); 
      });
    });

    it('should return 0 and "www.data.se:8000 not in list" if adress is not in file', function(){
      removeini(function(err,test){         
        assert.equal(test,true)
        fs.writeFile('test.ini','','utf8', function(err){
          assert.equal(err, null);
          fs.open('test.ini',"r",function(err,test){
            assert.equal(test,1);
            fs.readFile('test.ini',function(err,data){
              assert.equal(data,'');
              assert.equal(err,null)
              removeLine("test.ini",'www.data.se:8000',function(error, test){
                assert.equal(test,null);
                assert.equal(error,"www.data.se:8000 not in list");
                removeini(function(err,test){         
                  assert.equal(test,true)
                });
              });
            });
          }); 
        });
      });
    });
  });
});

