import assert = require('assert');
import fs = require('fs');
import * as file from './../file'
import { fileExists, appendLine, fileToString, removeLine, getLineAsTupleById, getAllLinesAsTuple, getLineAsTupleByName } from './../file';

interface ICallback{
  (error:Error, status:boolean) :void
}

function Zeroing(callback?:ICallback){
  fs.readFile('test.ini','utf8',function(err,data){
    if(!err){
      fs.unlink('test.ini',function(err){
        if(err)
          callback(new Error("Can't remove file"),false)
        else{
          callback(null,true)
        }
      })
    }
    else{
      callback(null,true)
    }
  })
}

export function fillData(file:boolean, data:boolean, callback?: ICallback){
  Zeroing(function(err,status){
    if(status){
      if(file){
        if(data){
          var fill ='#1 www.data.com:8000\n';
        }
        else{
          var fill ='';
        }
        fs.writeFile('test.ini',fill,function(err){
          if(err){
            callback(new Error("Can't create file and data"),false)
          }
          else{
            callback(null,true)
          }
        })
      }
      else{
        callback(null,true)
      }
    }
    else{
      callback(err,false)
    }
  })
}

describe('Testsetup',function(){
  describe('Setting up testdata',function(){
    it('fillData(false,false), Should not create a file with data',function(done){
      fillData(false,false,function(err,test){
        assert.equal(test,true)
        fs.readFile('test.ini','utf8',function(err,data){
          assert.equal(err,'Error: ENOENT: no such file or directory, open \'test.ini\'')
          done()
        })
      })
    })
    it('fillData(true,false), Should create an empty file',function(done){
      fillData(true,false,function(err,test){
        assert.equal(test,true)
        fs.readFile('test.ini','utf8',function(err,data){
          assert.equal(err,null)
          assert.equal(data,'')
          done()
        })
      })
    })
    it('fillData(true,true), Should creat a file filled with #1 www.data.com:8000\n',function(done){
      fillData(true,true,function(err,test){
        assert.equal(test,true)
        fs.readFile('test.ini','utf8',function(err,data){
          assert.equal(err,null)
          assert.equal(data,'#1 www.data.com:8000\n')
          done()
        })
      })
    })
  })
}) 

describe('File.ts', function() {
  describe('fileexists() checks if file exists if not creates it',function(){
    it('filldata(false,false, should create an empty file',function(done){
      fillData(false,false,function(err,test){
        assert.equal(test,true)
        fileExists('test.ini',function(err,test){
          assert.equal(test,1);
          assert.equal(err,null)
          fs.readFile('test.ini','utf8',function(err,data){
            assert.equal(err,null)
            assert.equal(data,'')
            done()
          }); 
        });
      });
    });  

    it('filldata(true,false, should not alter any data',function(done){
      fillData(true,false,function(){
        fileExists('test.ini',function(err,test){
          assert.equal(test,1);
          assert.equal(err,null) 
          fs.readFile('test.ini','utf8',function(err,data){
            assert.equal(err,null)
            assert.equal(data,'')
            done()             
          });
        });
      });
    });

    it('filldata(true,true), should not alter any data',function(done){
      fillData(true,true,function(){
        fileExists('test.ini',function(err,test){
          assert.equal(test,1);
          assert.equal(err,null) 
          fs.readFile('test.ini','utf8',function(err,data){
            assert.equal(err,null)
            assert.equal(data,'#1 www.data.com:8000\n')
            done()             
          });
        });
      });
    });
  });

  describe('appendline() adds an adress to named file', function(){
    it('filldata(false,false), file will be created and filled with data',function(done){
      fillData(false,false,function(){
        appendLine('test.ini', 'www.data.com:8000', function(error,test){
          assert.equal(test,true);
          assert.equal(error,null);
          fs.readFile('test.ini','utf8',function(err,data){
            assert.equal(err,null)
            assert.equal(data,'#1 www.data.com:8000\n')
            done() 
          });
        }); 
      });      
    });
    
    it("filldata(true,false), file will be filled with data, appendLine('test.ini', 'www.data.com:8000')",function(done){
      fillData(true,false,function(){
        appendLine('test.ini', 'www.data.com:8000', function(error,test){
          assert.equal(test,true);
          assert.equal(error,null);
          fs.readFile('test.ini','utf8',function(err,data){
            assert.equal(err,null)
            assert.equal(data,'#1 www.data.com:8000\n')
            done() 
          });
        }); 
      });      
    });

    it("filldata(true,true), file will fail because of adress already added, appendLine('test.ini', 'www.data.com:8000')",function(done){
      fillData(true,true,function(){
        appendLine('test.ini', 'www.data.com:8000', function(error,test){
          assert.equal(test,false);
          assert.equal(error,"Error: The line is already in test.ini");
          fs.readFile('test.ini','utf8',function(err,data){
            assert.equal(err,null)
            assert.equal(data,'#1 www.data.com:8000\n')
            done() 
          });
        }); 
      });      
    });

    it("filldata(true,true), file will add a new line, appendLine('test.ini', 'www.data2.com:8000')",function(done){
      fillData(true,true,function(){
        appendLine('test.ini', 'www.data2.com:8000', function(error,test){
          assert.equal(error,null);
          assert.equal(test,true);
          fs.readFile('test.ini','utf8',function(err,data){
            assert.equal(err,null)
            assert.equal(data,'#1 www.data.com:8000\n#2 www.data2.com:8000\n')
            done() 
          });
        }); 
      });      
    });
  });

  describe('fileToString() shows the file as a string', function(){
    it('fillData(false,false), should throw an error: File does not exist', function(done){
      fillData(false,false,function(){
        fileToString('test.ini', function(err, data){
          assert.equal(err,'Error: File does not exist');
          assert.equal(data,' ');
          done() 
        });
      });
    });
      
    it('fillData(true,false), should return an empty string',function(done){
      fillData(true,false,function(){
        fileToString('test.ini',function(err,data){
          assert.equal(err,null)
          assert.equal(data,'');
          done()
        });
      });
    });

    it('fillData(true,false), should return a string: #1 www.data.com:8000\n',function(done){
      fillData(true,true,function(){
        fileToString('test.ini',function(err,data){
          assert.equal(err,null)
          assert.equal(data,'#1 www.data.com:8000\n');
          done()
        });
      });
    });
  });

  describe('removeLine() remove specific line from file',function(){
    it('fillData(false,false), should return an error: test.ini does not exist',function(done){
      fillData(false,false,function(err,data){
        removeLine("test.ini",'www.data.com:8000',function(error, test){
          assert.equal(error,'Error: test.ini does not exist');
          assert.equal(test,false);
          done()
        });
      });
    });

    it('fillData(true,false), should return an error: www.data.com:8000 not in list',function(done){
      fillData(true,false,function(err,data){
        removeLine("test.ini",'www.data.com:8000',function(error, test){
          assert.equal(error, 'Error: www.data.com:8000 not in list');
          assert.equal(test,false);
          done()
        }); 
      });
    });

    it('fillData(true,true), should remove the adress and file should be empty',function(done){
      fillData(true,true,function(err,data){
        removeLine("test.ini",'www.data.com:8000',function(error, test){
          assert.equal(error, null);
          assert.equal(test,true);
          done()
        }); 
      });
    });

    it('fillData(true,true), should remove the adress and file should still have line 2',function(done){
      fillData(true,true,function(err,data){
        appendLine("test.ini",'www.data2.com:8000',function(error,test){
          removeLine("test.ini",'www.data.com:8000',function(error, test){
            assert.equal(error, null);
            assert.equal(test,true);
            fileToString('test.ini',function(error,data){
              assert.equal(data,'#2 www.data2.com:8000\n')
              done()
            });
          });
        }); 
      });
    });
  });

  describe('getLineAsTupleById(), returns a tuple by there id',function(){
    it('fillData(false,false), should return an error: The file is missing',function(done){
      fillData(false,false,function(err,data){
        getLineAsTupleById("test.ini",1,function(error, test){
          assert.equal(error,'Error: The file is missing');
          assert.equal(test,null);
          done();
        });
      });
    });
    it('fillData(true,false), should return an error: Error: ID not in list',function(done){
      fillData(true,false,function(err,data){
        getLineAsTupleById("test.ini",1,function(error, test){
          assert.equal(error,'Error: ID not in list');
          assert.equal(test,null);
          done();
        });
      });
    });

    it('fillData(true,true), should return the tuple ',function(done){
      fillData(true,true,function(err,data){
        getLineAsTupleById("test.ini",1,function(error, test){
          assert.equal(error,null);
          assert.equal(test[0],1);
          assert.equal(test[1],'www.data.com:8000')
          done();
        });
      });
    });

    it('fillData(true,true), should return the tuple chosen getLineAsTupleById("test.ini",2)',function(done){
      fillData(true,true,function(err,data){
        appendLine("test.ini", 'www.data2.com:8000', function(err,test){
          getLineAsTupleById("test.ini",2,function(error, test){
            assert.equal(error,null);
            assert.equal(test[0],2);
            assert.equal(test[1],'www.data2.com:8000')
            done();
          });
        });
      });
    });
  });
  describe('getLineAsTupleByName(), returns a tuple by there adress',function(){
    it('fillData(false,false), should return an error: The file is missing',function(done){
      fillData(false,false,function(err,data){
        getLineAsTupleByName("test.ini","www.data.com:8000",function(error, test){
          assert.equal(error,'Error: The file is missing');
          assert.equal(test,null);
          done();
        });
      });
    });
    it('fillData(true,false), should return an error: Error: ID not in list',function(done){
      fillData(true,false,function(err,data){
        getLineAsTupleByName("test.ini","www.data.com:8000",function(error, test){
          assert.equal(error,'Error: ID not in list');
          assert.equal(test,null);
          done();
        });
      });
    });
    
    it('fillData(true,true), should return the tuple ',function(done){
      fillData(true,true,function(err,data){
        getLineAsTupleByName("test.ini","www.data.com:8000",function(error, test){
          assert.equal(error,null);
          assert.equal(test[0],1);
          assert.equal(test[1],'www.data.com:8000')
          done();
        });
      });
    });

    it('fillData(true,true), should return the tuple chosen getLineAsTupleById("test.ini",2)',function(done){
      fillData(true,true,function(err,data){
        appendLine("test.ini", 'www.data2.com:8000', function(err,test){
          getLineAsTupleByName("test.ini","www.data2.com:8000",function(error, test){
            assert.equal(error,null);
            assert.equal(test[0],2);
            assert.equal(test[1],'www.data2.com:8000')
            done();
          });
        });
      });
    });
  });
  describe('getAllLineAsTuple(), returns all tuples',function(){
    it('fillData(false,false), should return an error: The file is missing',function(done){
      fillData(false,false,function(err,data){
        getAllLinesAsTuple("test.ini",function(error, test){
          assert.equal(error,'Error: test.ini does not exist');
          assert.equal(test,null);
          done();
        });
      });
    });
    it('fillData(true,false), should return an error: Error: ID not in list',function(done){
      fillData(true,false,function(err,data){
        getAllLinesAsTuple("test.ini",function(error, test){
          assert.equal(error,'Error: File is empty');
          assert.equal(test,null);
          done();
        });
      });
    });
    
    it('fillData(true,true), should return the tuple ',function(done){
      fillData(true,true,function(err,data){
        getAllLinesAsTuple("test.ini",function(error, test){
          assert.equal(error,null);
          assert.equal(test[0][0],1)
          assert.equal(test[0][1],'www.data.com:8000')
          done();
        });
      });
    });

    it('fillData(true,true), should return all the tuples)',function(done){
      fillData(true,true,function(err,data){
        appendLine("test.ini", 'www.data2.com:8000', function(err,test){
          getAllLinesAsTuple("test.ini",function(error, test){
            assert.equal(error,null);
            assert.equal(test[0][0],1);
            assert.equal(test[0][1],'www.data.com:8000')
            assert.equal(test[1][0],2)
            assert.equal(test[1][1],'www.data2.com:8000')
            done();
          });
        });
      });
    });
  });
});