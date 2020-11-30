import re
import glob

path_to_app = '../src/app';

def findComponentFile(componentSelector):
    for filePath in glob.glob(path_to_app + '/**/*.component.ts', recursive=True):
        f = open(filePath, 'r' )
        for line in f:
            if componentSelector in line:
                print('FILEPATH FOUND', filePath)
                f.close()
                return filePath
        f.close()
    return None

def findComponentFiles():
    d = dict()
    for filePath in glob.glob(path_to_app + '/**/*.component.ts', recursive=True):
        f = open(filePath, 'r' )
        content = f.read()
        f.close()
        print('\nFILEPATH', filePath)
        m = re.search("^[\t ]*?@Component\(\{([\s\w\W]*?)(selector: *)'([A-Za-z0-9-_]*)'([\s\w\W]*?)\}\)", content) # TODO: account for /* */ comments
        print(m)
        if m:
            print(m.group(3))
    return None

if __name__ == "__main__":
    findComponentFiles()