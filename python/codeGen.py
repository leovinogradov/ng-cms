def createNgComponent(element, indentLevel=0, indentation='  '):
    indent: str = indentation * indentLevel;
    selector = element['selector'];
    result = indent + '<' + selector
    result += '>\n'
    result += indent + '</' + selector + '>';
    return result

def insert1():
    file = open('./code/instructions.txt', 'r')
    mode = ''
    for line in file:
        print(line)
        if line.startswith('# END'):
            mode = ''
        if mode:
            if mode == "add module":
                handleAddModule(line)
        else:
            if line.startswith('# BEGIN'):
                mode = line[8:].strip('\n\r')
                print('Mode', mode, mode == "add module")
    file.close()

def handleAddModule(line):
    print("TEST2")
    arr = line.split(' ')
    location = arr[-1]
    modules = arr[1:-2]
    print('Modules', modules)



if __name__ == '__main__':
    print('TEST')
    insert1()