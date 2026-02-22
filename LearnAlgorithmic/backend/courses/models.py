from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Module(models.Model):
    """Représente un module d'apprentissage"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.IntegerField(unique=True)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"Module {self.order}: {self.title}"


class Lesson(models.Model):
    """Représente une leçon dans un module"""
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.IntegerField()
    
    # Contenu de la leçon
    video_url = models.URLField(blank=True, null=True)
    video_embed_code = models.TextField(blank=True, null=True, help_text="Code d'intégration de la vidéo")
    
    class Meta:
        ordering = ['order']
        unique_together = ['module', 'order']
    
    def __str__(self):
        return f"{self.module.title} - {self.title}"


class Concept(models.Model):
    """Concepts clés d'une leçon avec syntaxes"""
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='concepts')
    title = models.CharField(max_length=200)
    definition = models.TextField()
    syntax = models.TextField(help_text="Syntaxe à retenir")
    order = models.IntegerField()
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.lesson.title} - {self.title}"


class Example(models.Model):
    """Exemples illustratifs pour une leçon"""
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='examples')
    title = models.CharField(max_length=200)
    description = models.TextField()
    code = models.TextField()
    explanation = models.TextField()
    order = models.IntegerField()
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.lesson.title} - Exemple: {self.title}"


class Simulation(models.Model):
    """Simulations d'algorithmes avec animations"""
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='simulations')
    title = models.CharField(max_length=200)
    description = models.TextField()
    algorithm_code = models.TextField()
    order = models.IntegerField()
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.lesson.title} - Simulation: {self.title}"


class SimulationStep(models.Model):
    """Étapes d'une simulation"""
    simulation = models.ForeignKey(Simulation, on_delete=models.CASCADE, related_name='steps')
    step_number = models.IntegerField()
    description = models.TextField()
    state_data = models.JSONField(help_text="État des variables à cette étape")
    visual_data = models.JSONField(help_text="Données pour la visualisation")
    
    class Meta:
        ordering = ['step_number']
        unique_together = ['simulation', 'step_number']
    
    def __str__(self):
        return f"{self.simulation.title} - Étape {self.step_number}"


class Quiz(models.Model):
    """Quiz pour une leçon"""
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=200)
    order = models.IntegerField()
    passing_score = models.IntegerField(default=50)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.lesson.title} - Quiz: {self.title}"


class QuizQuestion(models.Model):
    """Questions d'un quiz"""
    QUESTION_TYPES = [
        ('single', 'Choix unique'),
        ('multiple', 'Choix multiples'),
        ('true_false', 'Vrai/Faux'),
    ]
    
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES)
    points = models.IntegerField(default=10)
    order = models.IntegerField()
    explanation = models.TextField(help_text="Explication de la bonne réponse")
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"Question {self.order}: {self.question_text[:50]}"


class QuizChoice(models.Model):
    """Choix de réponse pour une question de quiz"""
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='choices')
    choice_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order = models.IntegerField()
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.choice_text[:50]} ({'Correct' if self.is_correct else 'Incorrect'})"


class Exercise(models.Model):
    """Exercices pour une leçon"""
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='exercises')
    title = models.CharField(max_length=200)
    description = models.TextField()
    problem_statement = models.TextField()
    expected_output = models.TextField()
    solution_code = models.TextField(blank=True, null=True, help_text="Pseudo-code de la solution correcte")
    test_cases = models.JSONField(help_text="Cas de test pour validation automatique")
    points = models.IntegerField(default=20)
    order = models.IntegerField()
    hints = models.TextField(blank=True, null=True)
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Débutant'),
            ('intermediate', 'Intermédiaire'),
            ('advanced', 'Avancé'),
        ],
        default='beginner'
    )
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.lesson.title} - Exercice: {self.title}"

class UserProgress(models.Model):
    """Progression d'un utilisateur dans les modules"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    is_unlocked = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    completion_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['user', 'module']
    
    def __str__(self):
        return f"{self.user.username} - {self.module.title}"


class LessonProgress(models.Model):
    """Progression d'un utilisateur dans une leçon"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    is_completed = models.BooleanField(default=False)
    quiz_score = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    exercise_score = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    combined_score = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    completion_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        unique_together = ['user', 'lesson']
    
    def calculate_combined_score(self):
        """Calcule le score combiné (moyenne quiz + exercices)"""
        self.combined_score = (self.quiz_score + self.exercise_score) // 2
        return self.combined_score
    
    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} ({self.combined_score}%)"


class QuizAttempt(models.Model):
    """Tentative de quiz par un utilisateur"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    total_points = models.IntegerField()
    percentage = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    answers = models.JSONField(help_text="Réponses de l'utilisateur")
    completed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-completed_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} ({self.percentage}%)"


class ExerciseSubmission(models.Model):
    """Soumission d'exercice par un utilisateur"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    code_submitted = models.TextField()
    is_correct = models.BooleanField(default=False)
    score = models.IntegerField(default=0)
    feedback = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.exercise.title} ({'Réussi' if self.is_correct else 'Échoué'})"


class PasswordResetCode(models.Model):
    """Stocke les codes de vérification pour la réinitialisation de mot de passe"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_codes')
    code = models.CharField(max_length=6)  # Code à 6 chiffres
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()  # Expiration dans 15 minutes
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Code pour {self.user.username} - {'Utilisé' if self.is_used else 'Actif'}"

    def is_valid(self):
        """Vérifie si le code est toujours valide"""
        from django.utils import timezone
        return not self.is_used and timezone.now() < self.expires_at
