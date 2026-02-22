"""
Interpréteur de Pseudo-Code Algorithmique
==========================================
Ce module permet d'exécuter du pseudo-code algorithmique et de valider
les résultats par rapport aux sorties attendues.

Syntaxe supportée:
- Déclarations: entier x, reel y, chaine nom, booleen actif
- Affectation: x ← 5 ou x <- 5
- Opérations: +, -, *, /, MOD, DIV
- Comparaisons: =, <>, <, >, <=, >=
- Logique: ET, OU, NON
- Conditions: SI ... ALORS ... SINON ... FINSI
- Boucles: POUR ... DE ... A ... FAIRE ... FINPOUR
- Boucles: TANT QUE ... FAIRE ... FINTANTQUE
- Entrées/Sorties: LIRE(x), ECRIRE(x), AFFICHER(x)
"""

import re
import math
from typing import Dict, List, Tuple, Any, Optional


class PseudoCodeError(Exception):
    """Exception pour les erreurs d'exécution du pseudo-code"""
    def __init__(self, message: str, line: int = None):
        self.line = line
        self.message = message
        super().__init__(f"Ligne {line}: {message}" if line else message)


class PseudoInterpreter:
    """Interpréteur de pseudo-code algorithmique"""

    def __init__(self):
        self.variables: Dict[str, Any] = {}
        self.variable_types: Dict[str, str] = {}
        self.output: List[str] = []
        self.input_values: List[str] = []
        self.input_index: int = 0
        self.current_line: int = 0
        self.max_iterations: int = 10000  # Protection contre boucles infinies
        self.iteration_count: int = 0

    def reset(self):
        """Réinitialise l'interpréteur"""
        self.variables = {}
        self.variable_types = {}
        self.output = []
        self.input_index = 0
        self.current_line = 0
        self.iteration_count = 0

    def set_inputs(self, inputs: List[str]):
        """Définit les valeurs d'entrée pour LIRE()"""
        self.input_values = inputs
        self.input_index = 0

    def get_output(self) -> str:
        """Retourne la sortie sous forme de chaîne"""
        return "\n".join(str(o) for o in self.output)

    def _to_number(self, value: Any) -> Any:
        """Convertit une valeur en nombre si possible"""
        if isinstance(value, (int, float)):
            return value
        if isinstance(value, str):
            # Essayer de convertir en entier
            try:
                return int(value)
            except ValueError:
                pass
            # Essayer de convertir en réel
            try:
                return float(value)
            except ValueError:
                pass
        return value

    def execute(self, code: str, inputs: List[str] = None) -> Tuple[bool, str, str]:
        """
        Exécute le pseudo-code et retourne (success, output, error_message)
        """
        self.reset()
        if inputs:
            self.set_inputs(inputs)

        try:
            # Prétraitement du code
            lines = self.preprocess(code)

            # Exécution
            self.execute_block(lines, 0, len(lines))

            return True, self.get_output(), ""

        except PseudoCodeError as e:
            return False, self.get_output(), str(e)
        except Exception as e:
            return False, self.get_output(), f"Erreur inattendue: {str(e)}"

    def preprocess(self, code: str) -> List[str]:
        """Prétraite le code: supprime commentaires, normalise"""
        lines = []
        for line in code.split('\n'):
            # Supprimer les commentaires
            line = re.sub(r'//.*$', '', line)
            line = re.sub(r'#.*$', '', line)

            # Normaliser les espaces
            line = line.strip()

            # Supprimer le point-virgule en fin de ligne (style C/Pascal)
            if line.endswith(';'):
                line = line[:-1].strip()

            # Ignorer les lignes vides
            if line:
                # Normaliser les flèches d'affectation
                line = line.replace('<-', '←')
                line = line.replace(':=', '←')

                # Convertir = en ← pour les affectations (pas les comparaisons)
                # Une affectation: variable = expression (pas dans SI, pas ==, pas <=, >=, <>)
                line_upper = line.upper()
                if '=' in line and '←' not in line:
                    # Ne pas convertir si c'est une comparaison
                    if not any(op in line for op in ['==', '<=', '>=', '<>', '!=']):
                        # Ne pas convertir si c'est dans une condition SI ou TANT QUE
                        if not line_upper.startswith('SI ') and not line_upper.startswith('TANT QUE'):
                            # Convertir le premier = en ←
                            line = line.replace('=', '←', 1)

                lines.append(line)

        return lines

    def execute_block(self, lines: List[str], start: int, end: int) -> int:
        """Exécute un bloc de code de start à end"""
        i = start
        while i < end:
            self.current_line = i + 1
            self.iteration_count += 1

            if self.iteration_count > self.max_iterations:
                raise PseudoCodeError("Boucle infinie détectée (trop d'itérations)", i + 1)

            line = lines[i].upper()
            original_line = lines[i]

            # Ignorer lignes de structure vides
            if line in ['DEBUT', 'FIN', 'ALGORITHME', 'PROGRAMME', 'VARIABLES', 'VAR']:
                i += 1
                continue

            # Déclaration de variable
            if self.is_declaration(line):
                self.handle_declaration(original_line)
                i += 1

            # Affectation
            elif '←' in original_line:
                self.handle_assignment(original_line)
                i += 1

            # ECRIRE / AFFICHER
            elif line.startswith('ECRIRE') or line.startswith('AFFICHER'):
                self.handle_output(original_line)
                i += 1

            # LIRE
            elif line.startswith('LIRE'):
                self.handle_input(original_line)
                i += 1

            # SI ... ALORS
            elif line.startswith('SI '):
                i = self.handle_if(lines, i, end)

            # POUR ... FAIRE
            elif line.startswith('POUR '):
                i = self.handle_for(lines, i, end)

            # TANT QUE ... FAIRE
            elif line.startswith('TANT QUE') or line.startswith('TANTQUE'):
                i = self.handle_while(lines, i, end)

            # REPETER ... JUSQU'A
            elif line.startswith('REPETER') or line.startswith('RÉPÉTER'):
                i = self.handle_repeat(lines, i, end)

            # Ligne non reconnue - peut être une expression ou affectation implicite
            else:
                # Essayer comme affectation sans flèche (format: var = valeur)
                if '=' in original_line and '==' not in original_line and '<=' not in original_line and '>=' not in original_line and '<>' not in original_line:
                    self.handle_assignment(original_line.replace('=', '←', 1))
                i += 1

        return i

    def is_declaration(self, line: str) -> bool:
        """Vérifie si la ligne est une déclaration de variable"""
        upper = line.upper()
        types = ['ENTIER', 'REEL', 'RÉEL', 'CHAINE', 'CHAÎNE', 'BOOLEEN', 'BOOLÉEN', 'CARACTERE', 'CARACTÈRE']

        # Format 1: TYPE var1, var2 (ex: entier x, y)
        if any(upper.startswith(t + ' ') or upper.startswith(t + ':') for t in types):
            return True

        # Format 2: var1, var2 : TYPE (ex: x, y : entier  ou  variables: x, y : entier)
        if ':' in upper:
            after_colon = upper.split(':')[-1].strip()
            if any(after_colon.startswith(t) for t in types):
                return True

        # Format 3: VARIABLES: var1, var2 : TYPE (ex: variables: annee, age : entier)
        if upper.startswith('VARIABLES'):
            # Enlever "VARIABLES" et ":" du début
            rest = upper.replace('VARIABLES', '', 1).strip()
            if rest.startswith(':'):
                rest = rest[1:].strip()
            # Vérifier si ça contient un type à la fin
            if ':' in rest:
                after_last_colon = rest.split(':')[-1].strip()
                if any(after_last_colon.startswith(t) for t in types):
                    return True

        return False

    def handle_declaration(self, line: str):
        """Traite une déclaration de variable"""
        upper = line.upper()
        types_list = ['ENTIER', 'REEL', 'RÉEL', 'CHAINE', 'CHAÎNE', 'BOOLEEN', 'BOOLÉEN', 'CARACTERE', 'CARACTÈRE']

        var_type = None
        var_names_str = ""

        # Nettoyer la ligne si elle commence par "VARIABLES:" ou "VARIABLES :"
        working_line = line
        if upper.startswith('VARIABLES'):
            working_line = line[len('VARIABLES'):].strip()
            if working_line.startswith(':'):
                working_line = working_line[1:].strip()
        upper = working_line.upper()

        # Format 1: TYPE var1, var2 (ex: entier x, y)
        for t in types_list:
            if upper.startswith(t):
                var_type = t.replace('É', 'E').replace('Î', 'I')
                var_names_str = working_line[len(t):].strip().lstrip(':').strip()
                break

        # Format 2: var1, var2 : TYPE (ex: x, y : entier  ou  annee, age, anneeac : entier)
        if var_type is None and ':' in working_line:
            parts = working_line.split(':')
            if len(parts) >= 2:
                potential_type = parts[-1].strip().upper()
                for t in types_list:
                    if potential_type.startswith(t):
                        var_type = t.replace('É', 'E').replace('Î', 'I')
                        # Les noms sont tout ce qui précède le dernier ":"
                        var_names_str = ':'.join(parts[:-1]).strip()
                        break

        if not var_type:
            return

        # Extraire les noms de variables
        var_names = [v.strip() for v in var_names_str.split(',')]

        for var_name in var_names:
            # Gérer l'initialisation inline: entier x ← 5
            if '←' in var_name:
                parts = var_name.split('←')
                var_name = parts[0].strip()
                init_value = parts[1].strip()
                self.variable_types[var_name.lower()] = var_type
                self.variables[var_name.lower()] = self.evaluate_expression(init_value)
            else:
                var_name = var_name.strip()
                if var_name:
                    self.variable_types[var_name.lower()] = var_type
                    # Valeur par défaut selon le type
                    if var_type in ['ENTIER']:
                        self.variables[var_name.lower()] = 0
                    elif var_type in ['REEL']:
                        self.variables[var_name.lower()] = 0.0
                    elif var_type in ['CHAINE']:
                        self.variables[var_name.lower()] = ""
                    elif var_type in ['BOOLEEN']:
                        self.variables[var_name.lower()] = False
                    else:
                        self.variables[var_name.lower()] = None

    def handle_assignment(self, line: str):
        """Traite une affectation"""
        parts = line.split('←')
        if len(parts) != 2:
            raise PseudoCodeError(f"Affectation invalide: {line}", self.current_line)

        var_name = parts[0].strip().lower()
        expression = parts[1].strip()

        value = self.evaluate_expression(expression)
        self.variables[var_name] = value

    def handle_output(self, line: str):
        """Traite ECRIRE ou AFFICHER"""
        # Extraire le contenu entre parenthèses
        match = re.search(r'\((.*)\)', line, re.IGNORECASE)
        if match:
            content = match.group(1)
            # Évaluer chaque argument séparé par des virgules
            args = self.split_arguments(content)
            output_parts = []
            for arg in args:
                value = self.evaluate_expression(arg.strip())
                output_parts.append(str(value))
            self.output.append(" ".join(output_parts))
        else:
            # Format sans parenthèses: ECRIRE x
            content = re.sub(r'^(ECRIRE|AFFICHER)\s*', '', line, flags=re.IGNORECASE)
            value = self.evaluate_expression(content.strip())
            self.output.append(str(value))

    def handle_input(self, line: str):
        """Traite LIRE"""
        match = re.search(r'LIRE\s*\(([^)]+)\)', line, re.IGNORECASE)
        if match:
            var_name = match.group(1).strip().lower()
        else:
            var_name = re.sub(r'^LIRE\s*', '', line, flags=re.IGNORECASE).strip().lower()

        if self.input_index < len(self.input_values):
            value_str = self.input_values[self.input_index]
            self.input_index += 1

            # Convertir selon le type attendu
            var_type = self.variable_types.get(var_name, 'CHAINE')
            try:
                if var_type == 'ENTIER':
                    value = int(float(value_str))
                elif var_type == 'REEL':
                    value = float(value_str)
                elif var_type == 'BOOLEEN':
                    value = value_str.lower() in ['vrai', 'true', '1', 'oui']
                else:
                    value = value_str
            except ValueError:
                value = value_str

            self.variables[var_name] = value
        else:
            # Si pas d'entrée fournie, utiliser une valeur par défaut selon le type
            var_type = self.variable_types.get(var_name, None)

            # Si le type n'est pas déclaré, deviner selon le nom de la variable
            if var_type is None:
                var_lower = var_name.lower()
                # Noms typiques de variables numériques
                if any(hint in var_lower for hint in ['annee', 'age', 'nombre', 'nb', 'num', 'compteur', 'i', 'j', 'k', 'n', 'somme', 'total', 'quantite', 'prix', 'note', 'score', 'taille', 'longueur']):
                    var_type = 'ENTIER'
                elif any(hint in var_lower for hint in ['moyenne', 'pourcentage', 'taux', 'ratio']):
                    var_type = 'REEL'
                elif any(hint in var_lower for hint in ['est', 'has', 'is', 'peut', 'actif', 'valide']):
                    var_type = 'BOOLEEN'
                else:
                    var_type = 'ENTIER'  # Par défaut entier pour les calculs

            if var_type == 'ENTIER':
                self.variables[var_name] = 0
                self.variable_types[var_name] = 'ENTIER'
            elif var_type == 'REEL':
                self.variables[var_name] = 0.0
                self.variable_types[var_name] = 'REEL'
            elif var_type == 'BOOLEEN':
                self.variables[var_name] = False
                self.variable_types[var_name] = 'BOOLEEN'
            else:
                self.variables[var_name] = ""
                self.variable_types[var_name] = 'CHAINE'
            # Note: on ne lève plus d'erreur, on utilise une valeur par défaut

    def handle_if(self, lines: List[str], start: int, end: int) -> int:
        """Traite une structure SI ... ALORS ... SINON ... FINSI"""
        line = lines[start]

        # Extraire la condition
        match = re.search(r'SI\s+(.+?)\s+ALORS', line, re.IGNORECASE)
        if not match:
            raise PseudoCodeError(f"Structure SI invalide: {line}", start + 1)

        condition = match.group(1)
        condition_result = self.evaluate_condition(condition)

        # Trouver SINON et FINSI
        sinon_index = -1
        finsi_index = -1
        depth = 1
        i = start + 1

        while i < end and depth > 0:
            upper = lines[i].upper().strip()
            if upper.startswith('SI '):
                depth += 1
            elif upper == 'FINSI' or upper == 'FIN SI':
                depth -= 1
                if depth == 0:
                    finsi_index = i
            elif upper == 'SINON' and depth == 1:
                sinon_index = i
            i += 1

        if finsi_index == -1:
            raise PseudoCodeError("FINSI manquant", start + 1)

        # Exécuter le bloc approprié
        if condition_result:
            if sinon_index != -1:
                self.execute_block(lines, start + 1, sinon_index)
            else:
                self.execute_block(lines, start + 1, finsi_index)
        else:
            if sinon_index != -1:
                self.execute_block(lines, sinon_index + 1, finsi_index)

        return finsi_index + 1

    def handle_for(self, lines: List[str], start: int, end: int) -> int:
        """Traite une boucle POUR"""
        line = lines[start]

        # Format: POUR var DE debut A fin FAIRE
        match = re.search(r'POUR\s+(\w+)\s+(?:DE|ALLANT DE)\s+(.+?)\s+(?:A|À|JUSQU\'?A|JUSQUA)\s+(.+?)\s+(?:FAIRE|PAS)?', line, re.IGNORECASE)
        if not match:
            # Format alternatif: POUR var ← debut A fin FAIRE
            match = re.search(r'POUR\s+(\w+)\s*←\s*(.+?)\s+(?:A|À)\s+(.+?)\s+FAIRE', line, re.IGNORECASE)

        if not match:
            raise PseudoCodeError(f"Structure POUR invalide: {line}", start + 1)

        var_name = match.group(1).lower()
        start_val = int(self.evaluate_expression(match.group(2)))
        end_val = int(self.evaluate_expression(match.group(3)))

        # Extraire le pas si présent
        step = 1
        step_match = re.search(r'PAS\s+(-?\d+)', line, re.IGNORECASE)
        if step_match:
            step = int(step_match.group(1))
        elif start_val > end_val:
            step = -1

        # Trouver FINPOUR
        finpour_index = -1
        depth = 1
        i = start + 1

        while i < end and depth > 0:
            upper = lines[i].upper().strip()
            if upper.startswith('POUR '):
                depth += 1
            elif upper == 'FINPOUR' or upper == 'FIN POUR':
                depth -= 1
                if depth == 0:
                    finpour_index = i
            i += 1

        if finpour_index == -1:
            raise PseudoCodeError("FINPOUR manquant", start + 1)

        # Exécuter la boucle
        if step > 0:
            val = start_val
            while val <= end_val:
                self.variables[var_name] = val
                self.execute_block(lines, start + 1, finpour_index)
                val += step
        else:
            val = start_val
            while val >= end_val:
                self.variables[var_name] = val
                self.execute_block(lines, start + 1, finpour_index)
                val += step

        return finpour_index + 1

    def handle_while(self, lines: List[str], start: int, end: int) -> int:
        """Traite une boucle TANT QUE"""
        line = lines[start]

        # Extraire la condition
        match = re.search(r'TANT\s*QUE\s+(.+?)\s+FAIRE', line, re.IGNORECASE)
        if not match:
            raise PseudoCodeError(f"Structure TANT QUE invalide: {line}", start + 1)

        condition = match.group(1)

        # Trouver FINTANTQUE
        fintq_index = -1
        depth = 1
        i = start + 1

        while i < end and depth > 0:
            upper = lines[i].upper().strip()
            if upper.startswith('TANT QUE') or upper.startswith('TANTQUE'):
                depth += 1
            elif upper == 'FINTANTQUE' or upper == 'FIN TANT QUE' or upper == 'FINTQ':
                depth -= 1
                if depth == 0:
                    fintq_index = i
            i += 1

        if fintq_index == -1:
            raise PseudoCodeError("FINTANTQUE manquant", start + 1)

        # Exécuter la boucle
        while self.evaluate_condition(condition):
            self.execute_block(lines, start + 1, fintq_index)

        return fintq_index + 1

    def handle_repeat(self, lines: List[str], start: int, end: int) -> int:
        """Traite une boucle REPETER ... JUSQU'A"""
        # Trouver JUSQU'A
        jusqua_index = -1
        depth = 1
        i = start + 1

        while i < end and depth > 0:
            upper = lines[i].upper().strip()
            if upper.startswith('REPETER') or upper.startswith('RÉPÉTER'):
                depth += 1
            elif upper.startswith('JUSQU') or upper.startswith("JUSQU'"):
                depth -= 1
                if depth == 0:
                    jusqua_index = i
            i += 1

        if jusqua_index == -1:
            raise PseudoCodeError("JUSQU'A manquant", start + 1)

        # Extraire la condition
        condition_line = lines[jusqua_index]
        match = re.search(r"JUSQU'?\s*[AÀ]\s+(.+)", condition_line, re.IGNORECASE)
        if not match:
            raise PseudoCodeError(f"Condition JUSQU'A invalide: {condition_line}", jusqua_index + 1)

        condition = match.group(1)

        # Exécuter la boucle (au moins une fois)
        while True:
            self.execute_block(lines, start + 1, jusqua_index)
            if self.evaluate_condition(condition):
                break

        return jusqua_index + 1

    def split_arguments(self, content: str) -> List[str]:
        """Sépare les arguments en tenant compte des chaînes"""
        args = []
        current = ""
        in_string = False
        string_char = None
        depth = 0

        for char in content:
            if char in '"\'':
                if not in_string:
                    in_string = True
                    string_char = char
                elif char == string_char:
                    in_string = False
                current += char
            elif char == '(' and not in_string:
                depth += 1
                current += char
            elif char == ')' and not in_string:
                depth -= 1
                current += char
            elif char == ',' and not in_string and depth == 0:
                args.append(current.strip())
                current = ""
            else:
                current += char

        if current.strip():
            args.append(current.strip())

        return args

    def evaluate_expression(self, expr: str) -> Any:
        """Évalue une expression et retourne sa valeur"""
        expr = expr.strip()

        # Chaîne de caractères
        if (expr.startswith('"') and expr.endswith('"')) or (expr.startswith("'") and expr.endswith("'")):
            return expr[1:-1]

        # Booléens
        if expr.upper() in ['VRAI', 'TRUE']:
            return True
        if expr.upper() in ['FAUX', 'FALSE']:
            return False

        # Nombre entier
        try:
            return int(expr)
        except ValueError:
            pass

        # Nombre réel
        try:
            return float(expr)
        except ValueError:
            pass

        # Variable
        if expr.lower() in self.variables:
            return self.variables[expr.lower()]

        # Expression complexe - évaluer
        return self.evaluate_complex_expression(expr)

    def tokenize_expression(self, expr: str) -> List[str]:
        """Tokenize une expression en identifiants, nombres, opérateurs et chaînes"""
        tokens = []
        i = 0
        while i < len(expr):
            char = expr[i]

            # Ignorer les espaces
            if char.isspace():
                i += 1
                continue

            # Chaîne de caractères
            if char in '"\'':
                end_char = char
                j = i + 1
                while j < len(expr) and expr[j] != end_char:
                    j += 1
                tokens.append(expr[i:j+1])
                i = j + 1
                continue

            # Nombre
            if char.isdigit() or (char == '-' and i + 1 < len(expr) and expr[i+1].isdigit() and (not tokens or tokens[-1] in ['+', '-', '*', '/', '(', ','])):
                j = i
                if char == '-':
                    j += 1
                while j < len(expr) and (expr[j].isdigit() or expr[j] == '.'):
                    j += 1
                tokens.append(expr[i:j])
                i = j
                continue

            # Identifiant (variable ou mot-clé)
            if char.isalpha() or char == '_':
                j = i
                while j < len(expr) and (expr[j].isalnum() or expr[j] == '_'):
                    j += 1
                tokens.append(expr[i:j])
                i = j
                continue

            # Opérateurs multi-caractères
            if i + 1 < len(expr):
                two_char = expr[i:i+2]
                if two_char in ['<=', '>=', '<>', '!=', '==']:
                    tokens.append(two_char)
                    i += 2
                    continue

            # Opérateur simple ou parenthèse
            tokens.append(char)
            i += 1

        return tokens

    def evaluate_complex_expression(self, expr: str) -> Any:
        """Évalue une expression complexe avec opérateurs"""
        expr = expr.strip()

        # Gérer les parenthèses
        if expr.startswith('(') and expr.endswith(')'):
            # Vérifier que les parenthèses correspondent
            depth = 0
            for i, c in enumerate(expr):
                if c == '(':
                    depth += 1
                elif c == ')':
                    depth -= 1
                if depth == 0 and i < len(expr) - 1:
                    break
            else:
                return self.evaluate_complex_expression(expr[1:-1])

        # Tokenizer l'expression pour un parsing plus précis
        tokens = self.tokenize_expression(expr)

        # Opérateurs par priorité (du moins prioritaire au plus prioritaire)
        # Opérateurs logiques
        for op in [' OU ', ' OR ']:
            parts = self.split_by_operator(expr, op)
            if len(parts) > 1:
                result = self.evaluate_condition(parts[0])
                for part in parts[1:]:
                    result = result or self.evaluate_condition(part)
                return result

        for op in [' ET ', ' AND ']:
            parts = self.split_by_operator(expr, op)
            if len(parts) > 1:
                result = self.evaluate_condition(parts[0])
                for part in parts[1:]:
                    result = result and self.evaluate_condition(part)
                return result

        # NON
        if expr.upper().startswith('NON ') or expr.upper().startswith('NOT '):
            return not self.evaluate_condition(expr[4:])

        # Opérateurs de comparaison
        for op, func in [('<>', lambda a, b: a != b), ('!=', lambda a, b: a != b),
                         ('<=', lambda a, b: a <= b), ('>=', lambda a, b: a >= b),
                         ('<', lambda a, b: a < b), ('>', lambda a, b: a > b),
                         ('==', lambda a, b: a == b), ('=', lambda a, b: a == b)]:
            parts = self.split_by_operator(expr, op)
            if len(parts) == 2:
                left = self.evaluate_expression(parts[0])
                right = self.evaluate_expression(parts[1])
                return func(left, right)

        # Opérateurs arithmétiques - utiliser les tokens pour éviter les erreurs
        # Chercher + ou - depuis la droite (hors parenthèses et hors chaînes)
        depth = 0
        in_string = False
        for i in range(len(tokens) - 1, -1, -1):
            tok = tokens[i]
            if tok in ['"', "'"]:
                in_string = not in_string
            elif tok == ')':
                depth += 1
            elif tok == '(':
                depth -= 1
            elif depth == 0 and not in_string and tok in ['+', '-']:
                # Vérifier que ce n'est pas un signe unaire (au début ou après un opérateur)
                if i > 0 and tokens[i-1] not in ['+', '-', '*', '/', '(', ',']:
                    left_expr = ' '.join(tokens[:i])
                    right_expr = ' '.join(tokens[i+1:])
                    left = self.evaluate_expression(left_expr)
                    right = self.evaluate_expression(right_expr)
                    left = self._to_number(left)
                    right = self._to_number(right)
                    if tok == '+':
                        if isinstance(left, str) or isinstance(right, str):
                            return str(left) + str(right)
                        return left + right
                    else:
                        if isinstance(left, str) or isinstance(right, str):
                            raise PseudoCodeError(f"Impossible de soustraire: '{left_expr.strip()}' et '{right_expr.strip()}' doivent etre des nombres", self.current_line)
                        return left - right

        # Chercher * ou / depuis la droite
        depth = 0
        in_string = False
        for i in range(len(tokens) - 1, -1, -1):
            tok = tokens[i]
            if tok in ['"', "'"]:
                in_string = not in_string
            elif tok == ')':
                depth += 1
            elif tok == '(':
                depth -= 1
            elif depth == 0 and not in_string and tok in ['*', '/']:
                left_expr = ' '.join(tokens[:i])
                right_expr = ' '.join(tokens[i+1:])
                left = self.evaluate_expression(left_expr)
                right = self.evaluate_expression(right_expr)
                left = self._to_number(left)
                right = self._to_number(right)
                if isinstance(left, str) or isinstance(right, str):
                    raise PseudoCodeError(f"Impossible d'effectuer l'operation: les deux operandes doivent etre des nombres", self.current_line)
                if tok == '*':
                    return left * right
                else:
                    if right == 0:
                        raise PseudoCodeError("Division par zero", self.current_line)
                    return left / right

        # MOD et DIV
        for op in [' MOD ', ' DIV ']:
            parts = self.split_by_operator(expr.upper(), op)
            if len(parts) == 2:
                left = self.evaluate_expression(parts[0])
                right = self.evaluate_expression(parts[1])
                if op == ' MOD ':
                    return left % right
                else:
                    return left // right

        # Fonctions mathématiques
        func_match = re.match(r'(\w+)\s*\((.+)\)', expr, re.IGNORECASE)
        if func_match:
            func_name = func_match.group(1).upper()
            args_str = func_match.group(2)
            args = [self.evaluate_expression(a.strip()) for a in self.split_arguments(args_str)]

            if func_name == 'ABS':
                return abs(args[0])
            elif func_name == 'RACINE' or func_name == 'SQRT':
                return math.sqrt(args[0])
            elif func_name == 'CARRE' or func_name == 'SQR':
                return args[0] ** 2
            elif func_name == 'PUISSANCE' or func_name == 'POW':
                return args[0] ** args[1]
            elif func_name == 'ENT' or func_name == 'INT':
                return int(args[0])
            elif func_name == 'ARRONDI' or func_name == 'ROUND':
                return round(args[0])
            elif func_name == 'LONGUEUR' or func_name == 'LEN':
                return len(str(args[0]))

        # Variable simple
        if expr.lower() in self.variables:
            return self.variables[expr.lower()]

        # Si rien ne correspond, retourner tel quel
        return expr

    def split_by_operator(self, expr: str, op: str, from_right: bool = False) -> List[str]:
        """Sépare une expression par un opérateur en respectant les parenthèses"""
        parts = []
        current = ""
        depth = 0
        in_string = False
        string_char = None
        i = len(expr) - 1 if from_right else 0

        while (i >= 0 if from_right else i < len(expr)):
            char = expr[i]

            if char in '"\'':
                if not in_string:
                    in_string = True
                    string_char = char
                elif char == string_char:
                    in_string = False
                current = char + current if from_right else current + char
            elif char == '(' and not in_string:
                depth += 1 if from_right else -1
                current = char + current if from_right else current + char
            elif char == ')' and not in_string:
                depth += -1 if from_right else 1
                current = char + current if from_right else current + char
            elif depth == 0 and not in_string:
                # Vérifier si on a trouvé l'opérateur
                if from_right:
                    test_str = expr[max(0, i - len(op) + 1):i + 1]
                else:
                    test_str = expr[i:i + len(op)]

                if test_str.upper() == op.upper():
                    if from_right:
                        parts.insert(0, current)
                        current = ""
                        i -= len(op)
                    else:
                        parts.append(current)
                        current = ""
                        i += len(op) - 1
                else:
                    current = char + current if from_right else current + char
            else:
                current = char + current if from_right else current + char

            i += -1 if from_right else 1

        if current:
            if from_right:
                parts.insert(0, current)
            else:
                parts.append(current)

        return parts

    def evaluate_condition(self, condition: str) -> bool:
        """Évalue une condition booléenne"""
        result = self.evaluate_expression(condition)
        if isinstance(result, bool):
            return result
        if isinstance(result, (int, float)):
            return result != 0
        if isinstance(result, str):
            return len(result) > 0
        return bool(result)


def _outputs_match(actual: str, expected: str) -> bool:
    """
    Compare deux sorties de maniere flexible.
    Gere les cas ou la sortie contient des messages de prompt en plus du resultat.
    """
    # 1. Match exact
    if actual == expected:
        return True

    # 2. Match insensible a la casse et aux espaces multiples
    actual_clean = ' '.join(actual.lower().split())
    expected_clean = ' '.join(expected.lower().split())
    if actual_clean == expected_clean:
        return True

    # 3. La sortie attendue est contenue dans la sortie reelle
    #    (ex: sortie = "Entrez un nombre:\n15", attendu = "15")
    if expected_clean in actual_clean:
        return True

    # 4. Comparaison par valeurs numeriques
    actual_numbers = re.findall(r'-?\d+\.?\d*', actual)
    expected_numbers = re.findall(r'-?\d+\.?\d*', expected)

    if expected_numbers and actual_numbers:
        # Verifier si tous les nombres attendus apparaissent dans la sortie
        matched = 0
        for exp_num in expected_numbers:
            exp_val = float(exp_num)
            for act_num in actual_numbers:
                if abs(float(act_num) - exp_val) < 0.001:
                    matched += 1
                    break
        if matched == len(expected_numbers):
            return True

        # Au moins le dernier nombre correspond (resultat final)
        if abs(float(actual_numbers[-1]) - float(expected_numbers[-1])) < 0.001:
            return True

    # 5. Comparer la derniere ligne de la sortie avec l'attendu
    actual_lines = [l.strip() for l in actual.split('\n') if l.strip()]
    if actual_lines:
        last_line = actual_lines[-1]
        if last_line == expected or ' '.join(last_line.lower().split()) == expected_clean:
            return True
        # Derniere ligne contient la sortie attendue
        if expected_clean in ' '.join(last_line.lower().split()):
            return True

    return False


def validate_pseudo_code(code: str, test_cases: List[Dict]) -> Tuple[bool, int, List[str]]:
    """
    Valide du pseudo-code avec des cas de test.

    Args:
        code: Le pseudo-code à exécuter
        test_cases: Liste de dicts avec 'inputs' et 'expected_output'

    Returns:
        (success, score, feedback_list)
    """
    interpreter = PseudoInterpreter()
    feedback = []
    passed_tests = 0
    total_tests = len(test_cases)

    if total_tests == 0:
        return True, 100, ["Aucun cas de test défini"]

    for i, test_case in enumerate(test_cases):
        inputs = test_case.get('inputs', [])
        expected = str(test_case.get('expected_output', '')).strip()

        success, output, error = interpreter.execute(code, inputs)
        output = output.strip()

        if not success:
            feedback.append(f"Test {i + 1}: Erreur d'execution - {error}")
        elif _outputs_match(output, expected):
            passed_tests += 1
            feedback.append(f"Test {i + 1}: Correct")
        else:
            feedback.append(f"Test {i + 1}: Sortie incorrecte - attendu: {expected}, obtenu: {output}")

    score = int((passed_tests / total_tests) * 100)
    is_correct = score >= 50

    return is_correct, score, feedback


# Test rapide
if __name__ == "__main__":
    code = """
    entier n, i, somme
    somme ← 0
    LIRE(n)
    POUR i DE 1 A n FAIRE
        somme ← somme + i
    FINPOUR
    ECRIRE(somme)
    """

    test_cases = [
        {"inputs": ["5"], "expected_output": "15"},
        {"inputs": ["10"], "expected_output": "55"},
    ]

    success, score, feedback = validate_pseudo_code(code, test_cases)
    print(f"Success: {success}, Score: {score}%")
    for f in feedback:
        print(f)
