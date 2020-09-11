import re

path_to_app = '../src/app';

def read(p):
    print("Reading:", p)
    file = open(p, 'r')
    s = file.read()
    file.close()
    return s

def findNextTag(text):
    return re.search("(<.*?>)|(</.*?>)", text)

def goThroughNextElement(text):
    m = findNextTag(text)
    if not m or m.group(0)[0:2] == '</':
        print('Invalid First Tag:', m)
        return (None, None,)
    pos = m.span(0)[1]
    text = text[pos:]
    level = 1
    while level > 0:
        m = findNextTag(text)
        if not m:
            print('Failed to find next tag, exiting loop')
            break
        tag = m.group(0)
        pos = m.span(0)[1]
        if (tag[0:2] != '</'):
            # open tag
            level += 1
        else:
            level -= 1
        text = text[pos:]

    # m = findNextTag(text)
    # if not m or m.group(0)[0:2] != '</':
    #     print('Invalid Last Tag:', m)
    #     raise Exception('Invalid last tag')
    # pos = m.span(0)[1]
    # text = text[pos:]
    return text

def searchV2(_text, details, removeNodeContents=True):
    text = _text
    position = 0
    length = len(details)
    i = 1

    while i < length:
        d = details[i]
        childrenToGoThrough = d['index'];

        for c in range(childrenToGoThrough):
            newText = goThroughNextElement(text)
            print('### Child', i, c)
            print(newText)

            if newText != None:
                text = newText
            else:
                return (None, None, None,)

        m = findNextTag(text)
        position = m.span(0)[1]
        text = text[position:]

        print('### Element', i)
        print(text)

        i += 1

    if (removeNodeContents and 'childCount' in d):
        childrenToGoThrough = d['childCount']
        for _ in range(childrenToGoThrough):
            newText = goThroughNextElement(text)
            if newText != None:
                text = newText

    return (text, i - 1,)



def goThroughChildrenIterative(childrenToGoThrough, level, text, position):
    while (childrenToGoThrough > 0):
        levelAt = level
        while True:
            open = re.search('(<div){1}.*', text);
            close = re.search('(</div>){1}.*', text);
            if (open and close and open.span(0)[1] < close.span(0)[1]):
                spanOpen = open.span(0)
                spanClose = close.span(0)
                levelAt += 1
                text = text[spanOpen[1]:]
                position = spanOpen[1]
                # print("==== Open ====")
                continue

            if not open and not close: break

            if (not open and close) or (open.span(0)[1] > close.span(0)[1]):
                spanClose = close.span(0)
                levelAt -= 1
                text = text[spanClose[1]:]
                position = spanClose[1]
                # print("==== Close ====")
                # print('levelAt =', levelAt)
                if levelAt == level:
                    # print('Exiting.')
                    childrenToGoThrough -= 1;
                    break
    return (text, position,)

def search(_text, details, removeNodeContents=True):
    #n = re.search('(?<=div)', text);
    #print(n)
    text = _text
    position = 0
    length = len(details)
    level = 0
    i = 1
    d = None
    while i < length:
        d = details[i]
        print('DETAILS', i, d)
        childrenToGoThrough = d['index'];

        print(i, "==== TEXT BEFORE ====")
        print(text)

        text, position = goThroughChildrenIterative(childrenToGoThrough, level, text, position)

        i += 1

        m = re.search('(<div){1}.*', text)
        if (m):
            start, end = m.span(0)
            text = text[end:]
            level += 1
            position = end
        else:
            print('Could not find div, text =')
            print(text)
            raise Exception("Could not find div");

        print(i, "==== TEXT AFTER ====")
        print(text)

    if (removeNodeContents and 'parsableChildCount' in d):
        text, position = goThroughChildrenIterative(d['parsableChildCount'], level, text, position)

    return (text, position, level)





def addRowWith2Cols(level=0, indentation='    '):
    i1 = (indentation * level)
    i2 = (indentation * (level+1))
    s = '\n';
    s += i1 + '<div class="row">\n'
    s += i2 + '<div class="col-sm-6">\n'
    s += i2 + '</div>\n'
    s += i2 + '<div class="col-sm-6">\n'
    s += i2 + '</div>\n'
    s += i1 + '</div>'
    return s


def getIndentedCode(elementDescription, level=0, indentation='    '):
    elementFilename = elementDescription['filename'];
    p = "./code/" + elementFilename
    file = open(p, 'r')
    s = ""
    indent = indentation * level
    for line in file.readlines():
        s += indent + line
    file.close()
    return s


def addElement(filepath, elementDescription, details):
    content = read(filepath)
    # print("--- content before ---\n", content)

    content_after, level = searchV2(content, details)
    position = len(content) - len(content_after)
    print('=== BEFORE === ')
    print(content[:position])
    print('\n=== AFTER ===')
    print(content_after)

    result = content[:position]
    result += getIndentedCode(elementDescription)
    result += content_after

    # print("\n--- content after ---\n", result)

    file = open(filepath, 'w')
    file.write(result)
    file.close()

def insert(data: dict):
    _p = data['path']
    details = data['details']
    element = data['element']
    print('PATH SENT', _p)
    print('DETAILS', details)
    print('ELEMENT', element)
    if not _p or not element: return;

    p = path_to_app + _p

    addElement(p, element, details)


if __name__ == "__main__":
    path = '../src/app/views/hello/hello.component.html'
    details = [{'localName': 'app-hello', 'className': '', 'index': 0, 'childCount': 1}, {'localName': 'div', 'className': 'container', 'childCount': 3, 'index': 0}, {'localName': 'div', 'className': 'row', 'childCount': 2, 'index': 1, 'parsableChildCount': 2}]
    _text = read(path)
    text, position, level = search(_text, details)
    print(text)
    print(position, level)
